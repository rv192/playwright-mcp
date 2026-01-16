import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleWaitFor(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const time = args.time as number | undefined;
  const text = args.text as string | undefined;
  const textGone = args.textGone as string | undefined;

  if (time !== undefined) {
    await page.waitForTimeout(time * 1000);
    return textResult(`Waited for ${time} seconds`);
  }

  if (text) {
    await page.getByText(text).waitFor({ 
      state: 'visible', 
      timeout: config.navigationTimeout 
    });
    return textResult(`Text "${text}" appeared`);
  }

  if (textGone) {
    await page.getByText(textGone).waitFor({ 
      state: 'hidden', 
      timeout: config.navigationTimeout 
    });
    return textResult(`Text "${textGone}" disappeared`);
  }

  return textResult('Nothing to wait for');
}
