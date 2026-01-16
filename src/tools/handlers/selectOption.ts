import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

export async function handleSelectOption(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const ref = args.ref as string;
  const element = args.element as string;
  const values = args.values as string[];

  const locator = await resolveRef(page, ref);
  await locator.selectOption(values, { timeout: config.actionTimeout });

  return textResult(`Selected "${values.join(', ')}" in "${element}"`);
}
