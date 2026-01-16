import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleNavigate(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const url = args.url as string;
  await browser.navigate(url);
  const page = await browser.getPage();
  const title = await page.title();
  return textResult(`Navigated to ${url}\nTitle: ${title}`);
}

export async function handleNavigateBack(
  _args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  await browser.goBack();
  const page = await browser.getPage();
  return textResult(`Navigated back to ${page.url()}`);
}
