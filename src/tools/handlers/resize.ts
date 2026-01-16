import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleResize(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const width = args.width as number;
  const height = args.height as number;

  await browser.resize(width, height);

  return textResult(`Resized browser to ${width}x${height}`);
}
