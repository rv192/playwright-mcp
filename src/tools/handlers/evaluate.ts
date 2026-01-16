import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

export async function handleEvaluate(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const fn = args.function as string;
  const ref = args.ref as string | undefined;

  let result: unknown;

  if (ref) {
    const locator = await resolveRef(page, ref);
    const element = await locator.elementHandle({ timeout: config.actionTimeout });
    if (!element) {
      throw new Error('Could not get element handle');
    }
    result = await page.evaluate(fn, element);
  } else {
    result = await page.evaluate(fn);
  }

  const output = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
  return textResult(output);
}
