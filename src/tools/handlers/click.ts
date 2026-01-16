import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

type MouseButton = 'left' | 'right' | 'middle';
type Modifier = 'Alt' | 'Control' | 'ControlOrMeta' | 'Meta' | 'Shift';

export async function handleClick(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const ref = args.ref as string;
  const element = args.element as string;
  const doubleClick = args.doubleClick as boolean | undefined;
  const button = (args.button as MouseButton) || 'left';
  const modifiers = args.modifiers as Modifier[] | undefined;

  const locator = await resolveRef(page, ref);

  const clickOptions: {
    button?: MouseButton;
    clickCount?: number;
    timeout?: number;
    modifiers?: Modifier[];
  } = {
    button,
    timeout: config.actionTimeout,
  };

  if (doubleClick) {
    clickOptions.clickCount = 2;
  }

  if (modifiers && modifiers.length > 0) {
    clickOptions.modifiers = modifiers;
  }

  await locator.click(clickOptions);

  return textResult(`Clicked on "${element}"`);
}
