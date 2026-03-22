---
name: ralph
description: Convert a PRD markdown file to prd.json format for the Ralph autonomous agent loop. Use when the user says "convert this prd", "turn into ralph format", "create prd.json", or "convert tasks/prd-*.md to prd.json".
author: snarktank/ralph
version: 1.0.0
---

# Ralph Skill

Convert a PRD markdown file into `prd.json` format for autonomous execution by the Ralph loop.

## Step 1: Read the PRD

Read the specified markdown PRD file (e.g., `tasks/prd-feature-name.md`).

## Step 2: Extract and Structure

Convert the PRD into this JSON structure:

```json
{
  "branchName": "ralph/[feature-name-kebab-case]",
  "userStories": [
    {
      "id": 1,
      "title": "[Story title]",
      "description": "[Full user story: As a X, I want Y, so that Z]",
      "acceptanceCriteria": [
        "[Criterion 1]",
        "[Criterion 2]"
      ],
      "passes": false,
      "priority": 1
    }
  ]
}
```

## Rules

- Set all `passes` to `false`
- Number stories sequentially starting at 1
- Set `priority` in the order they should be implemented (1 = first)
- `branchName` should be lowercase kebab-case: `ralph/add-user-auth`
- Keep acceptance criteria specific and testable
- Each story should map 1:1 with a user story from the PRD

## Step 3: Save

Save as `prd.json` in the project root (or `scripts/ralph/prd.json` if using that structure).

## Step 4: Confirm

After saving, tell the user:

```
prd.json created with [N] stories.

To run Ralph:
  ./scripts/ralph/ralph.sh --tool claude 10

To check progress:
  cat prd.json | jq '.userStories[] | {id, title, passes}'
```
