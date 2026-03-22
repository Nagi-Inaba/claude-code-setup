#!/usr/bin/env node

/**
 * sync-skills-to-onedrive.js
 *
 * ~/.claude/skills/ の内容を OneDrive/claudecodeskills/ に同期する。
 * SessionEnd フックで自動実行される。
 *
 * 同期方向: ~/.claude/skills/ → OneDrive/claudecodeskills/ (一方向)
 * OneDrive 固有のスキル（company, secretary, prd, ralph 等）は保持される。
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const HOME = process.env.HOME || process.env.USERPROFILE;
const SOURCE = path.join(HOME, '.claude', 'skills');
const DEST = path.join(HOME, 'OneDrive', 'claudecodeskills');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function syncSkills() {
  if (!fs.existsSync(SOURCE) || !fs.existsSync(DEST)) {
    return;
  }

  const sourceSkills = fs.readdirSync(SOURCE, { withFileTypes: true })
    .filter(d => d.isDirectory() && d.name !== 'learned')
    .map(d => d.name);

  let synced = 0;

  for (const skill of sourceSkills) {
    const srcDir = path.join(SOURCE, skill);
    const destDir = path.join(DEST, skill);

    const srcSkillMd = path.join(srcDir, 'SKILL.md');
    if (!fs.existsSync(srcSkillMd)) continue;

    const srcMtime = fs.statSync(srcSkillMd).mtimeMs;
    const destSkillMd = path.join(destDir, 'SKILL.md');
    const destMtime = fs.existsSync(destSkillMd) ? fs.statSync(destSkillMd).mtimeMs : 0;

    if (srcMtime > destMtime) {
      copyDirRecursive(srcDir, destDir);
      synced++;
    }
  }

  if (synced > 0) {
    const allSkillDirs = fs.readdirSync(DEST, { withFileTypes: true })
      .filter(d => d.isDirectory() && !d.name.startsWith('.'))
      .length;

    const guideFile = path.join(DEST, 'SKILLS-GUIDE.md');
    if (fs.existsSync(guideFile)) {
      let guide = fs.readFileSync(guideFile, 'utf8');
      guide = guide.replace(
        /全\d+スキル/g,
        `全${allSkillDirs}スキル`
      );
      fs.writeFileSync(guideFile, guide, 'utf8');
    }
  }
}

try {
  syncSkills();
} catch (e) {
  // Silent fail - don't block session end
}
