import type { BrowserManager } from '../../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../../types.js';
import { textResult, errorResult } from '../index.js';

export async function handleRunCode(
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  if (!config.enableRunCode) {
    return errorResult(
      'browser_run_code is disabled for security reasons. ' +
      'Start the server with --enable-run-code flag to enable it.'
    );
  }

  const code = args.code as string;
  const page = await browser.getPage();

  const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
  const fn = new AsyncFunction('page', code);
  
  const result = await fn(page);

  const output = result === undefined 
    ? 'Code executed successfully (no return value)'
    : typeof result === 'string' 
      ? result 
      : JSON.stringify(result, null, 2);

  return textResult(output);
}
