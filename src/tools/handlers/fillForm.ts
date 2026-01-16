import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult } from '../index.js';
import { resolveRef } from '../../snapshot/resolve.js';

interface FormField {
  name: string;
  type: 'textbox' | 'checkbox' | 'radio' | 'combobox' | 'slider';
  ref: string;
  value: string;
}

export async function handleFillForm(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const page = await browser.getPage();
  const fields = args.fields as FormField[];
  const results: string[] = [];

  for (const field of fields) {
    const locator = await resolveRef(page, field.ref);

    switch (field.type) {
      case 'textbox':
        await locator.fill(field.value, { timeout: config.actionTimeout });
        results.push(`Filled "${field.name}" with "${field.value}"`);
        break;

      case 'checkbox':
        if (field.value === 'true') {
          await locator.check({ timeout: config.actionTimeout });
        } else {
          await locator.uncheck({ timeout: config.actionTimeout });
        }
        results.push(`Set checkbox "${field.name}" to ${field.value}`);
        break;

      case 'radio':
        await locator.check({ timeout: config.actionTimeout });
        results.push(`Selected radio "${field.name}"`);
        break;

      case 'combobox':
        await locator.selectOption(field.value, { timeout: config.actionTimeout });
        results.push(`Selected "${field.value}" in "${field.name}"`);
        break;

      case 'slider':
        const numValue = parseFloat(field.value);
        await locator.fill(String(numValue), { timeout: config.actionTimeout });
        results.push(`Set slider "${field.name}" to ${numValue}`);
        break;
    }
  }

  return textResult(`Form filled:\n${results.join('\n')}`);
}
