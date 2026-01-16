import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function handleScreenshot(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const type = (args.type as 'png' | 'jpeg') || 'png';
  const filename = args.filename as string | undefined;
  const ref = args.ref as string | undefined;
  const fullPage = args.fullPage as boolean | undefined;

  let buffer: Buffer;

  if (ref) {
    const locator = await resolveRef(page, ref);
    buffer = await locator.screenshot({ type, timeout: config.actionTimeout });
  } else {
    buffer = await page.screenshot({ type, fullPage });
  }

  if (filename) {
    const filepath = join(config.outputDir, filename);
    await writeFile(filepath, buffer);
    return textResult(`Screenshot saved to ${filepath}`);
  }

  const base64 = buffer.toString('base64');
  const mimeType = type === 'png' ? 'image/png' : 'image/jpeg';

  return {
    content: [{
      type: 'image',
      data: base64,
      mimeType,
    }],
  };
}
