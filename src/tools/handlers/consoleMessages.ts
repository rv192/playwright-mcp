import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleConsoleMessages(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const level = (args.level as string) || 'info';
  const messages = browser.getConsoleMessages(level);

  if (messages.length === 0) {
    return textResult('No console messages');
  }

  const lines = messages.map(m => `[${m.type}] ${m.text}`);

  return textResult(`Console Messages (${messages.length}):\n${lines.join('\n')}`);
}
