/**
 * WebFetch ドメインガード
 * 許可ドメインリスト以外への WebFetch をブロックする PreToolUse フック
 *
 * ブロックするには exit code 2 を返す（Claude Code の仕様）
 * ドメインを追加する場合は ALLOWED_DOMAINS に追記する
 */

const ALLOWED_DOMAINS = [
  // Anthropic / Claude
  'anthropic.com',
  'claude.ai',
  'code.claude.com',

  // GitHub
  'github.com',
  'raw.githubusercontent.com',
  'api.github.com',
  'gist.github.com',

  // 特許データベース（先行技術調査用）
  'j-platpat.inpit.go.jp',
  'patents.google.com',
  'worldwide.espacenet.com',
  'patft.uspto.gov',
  'ppubs.uspto.gov',
  'www.j-platpat.inpit.go.jp',

  // 技術ドキュメント
  'docs.python.org',
  'nodejs.org',
  'developer.mozilla.org',
  'pypi.org',
  'npmjs.com',
  'registry.npmjs.org',

  // 一般リファレンス
  'stackoverflow.com',
  'qiita.com',
  'zenn.dev',
];

let data = '';
process.stdin.on('data', chunk => { data += chunk; });
process.stdin.on('end', () => {
  let url = '';
  try {
    const input = JSON.parse(data || '{}');
    url = input.tool_input?.url || '';
  } catch {
    // JSON パース失敗時は安全側に倒してブロック
    console.error('[WebFetch Guard] 入力の解析に失敗しました。');
    process.exit(2);
  }

  if (!url) {
    console.error('[WebFetch Guard] URL が空です。');
    process.exit(2);
  }

  let hostname = '';
  try {
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    console.error(`[WebFetch Guard] 無効な URL: ${url}`);
    process.exit(2);
  }

  const isAllowed = ALLOWED_DOMAINS.some(
    d => hostname === d || hostname.endsWith('.' + d)
  );

  if (!isAllowed) {
    console.error(
      `[WebFetch Guard] ブロック: ${hostname} は許可ドメインリストにありません。\n` +
      `許可が必要な場合は ~/.claude/scripts/hooks/webfetch-domain-guard.js の ALLOWED_DOMAINS に追加してください。`
    );
    process.exit(2);
  }

  process.exit(0);
});
