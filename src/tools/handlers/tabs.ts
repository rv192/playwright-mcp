import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult, errorResult } from '../index.js';

export async function handleTabs(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const action = args.action as 'list' | 'new' | 'close' | 'select';
  const index = args.index as number | undefined;

  switch (action) {
    case 'list': {
      const tabs = await browser.listTabs();
      const lines = tabs.map((t, i) => `[${i}] ${t.title} - ${t.url}`);
      return textResult(`Tabs (${tabs.length}):\n${lines.join('\n')}`);
    }

    case 'new': {
      const newIndex = await browser.newTab();
      return textResult(`Created new tab at index ${newIndex}`);
    }

    case 'close': {
      await browser.closeTab(index);
      return textResult(`Closed tab${index !== undefined ? ` at index ${index}` : ''}`);
    }

    case 'select': {
      if (index === undefined) {
        return errorResult('Tab index required for select action');
      }
      await browser.selectTab(index);
      return textResult(`Switched to tab ${index}`);
    }

    default:
      return errorResult(`Unknown tab action: ${action}`);
  }
}
