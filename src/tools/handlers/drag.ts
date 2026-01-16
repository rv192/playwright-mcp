import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

export async function handleDrag(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const startRef = args.startRef as string;
  const endRef = args.endRef as string;
  const startElement = args.startElement as string;
  const endElement = args.endElement as string;

  const sourceLocator = await resolveRef(page, startRef);
  const targetLocator = await resolveRef(page, endRef);

  await sourceLocator.dragTo(targetLocator, { timeout: config.actionTimeout });

  return textResult(`Dragged "${startElement}" to "${endElement}"`);
}
