import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleNetworkRequests(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const includeStatic = args.includeStatic as boolean || false;
  const requests = browser.getNetworkRequests(includeStatic);

  if (requests.length === 0) {
    return textResult('No network requests recorded');
  }

  const lines = requests.map(r => {
    const status = r.status ? ` [${r.status}]` : ' [pending]';
    return `${r.method} ${r.url}${status} (${r.type})`;
  });

  return textResult(`Network Requests (${requests.length}):\n${lines.join('\n')}`);
}
