import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handlePressKey(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const key = args.key as string;

  await page.keyboard.press(key);

  return textResult(`Pressed key "${key}"`);
}
