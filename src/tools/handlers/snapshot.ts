import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { captureSnapshot } from '../../snapshot/snapshot.js';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function handleSnapshot(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const snapshot = await captureSnapshot(page);

  if (args.filename) {
    const filepath = join(config.outputDir, args.filename as string);
    await writeFile(filepath, snapshot, 'utf-8');
    return textResult(`Snapshot saved to ${filepath}`);
  }

  return textResult(snapshot);
}
