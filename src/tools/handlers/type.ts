import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

export async function handleType(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const ref = args.ref as string;
  const element = args.element as string;
  const text = args.text as string;
  const submit = args.submit as boolean | undefined;
  const slowly = args.slowly as boolean | undefined;

  const locator = await resolveRef(page, ref);

  if (slowly) {
    await locator.pressSequentially(text, { timeout: config.actionTimeout });
  } else {
    await locator.fill(text, { timeout: config.actionTimeout });
  }

  if (submit) {
    await locator.press('Enter', { timeout: config.actionTimeout });
  }

  return textResult(`Typed "${text}" into "${element}"${submit ? ' and submitted' : ''}`);
}
