import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult, errorResult } from '../index.js';

export async function handleDialog(
  args: Record<string, unknown>,
  browser: BrowserManager,
  _config: ServerConfig
): Promise<ToolResult> {
  const accept = args.accept as boolean;
  const promptText = args.promptText as string | undefined;

  const dialog = browser.getPendingDialog();
  if (!dialog) {
    return errorResult('No pending dialog to handle');
  }

  if (accept) {
    await dialog.accept(promptText);
  } else {
    await dialog.dismiss();
  }

  browser.clearPendingDialog();

  const action = accept ? 'Accepted' : 'Dismissed';
  return textResult(`${action} dialog: "${dialog.message()}"`);
}
