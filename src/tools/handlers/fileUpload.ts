import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';

export async function handleFileUpload(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const paths = args.paths as string[] | undefined;

  const fileChooserPromise = page.waitForEvent('filechooser', { timeout: config.actionTimeout });
  
  if (!paths || paths.length === 0) {
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([]);
    return textResult('File chooser cancelled');
  }

  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(paths);

  return textResult(`Uploaded ${paths.length} file(s): ${paths.join(', ')}`);
}
