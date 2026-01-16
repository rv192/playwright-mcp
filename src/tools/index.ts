import type { ToolName } from './schema.js';
import type { BrowserManager } from '../browser/BrowserManager.js';
import type { ServerConfig, ToolResult } from '../types.js';

import { handleNavigate, handleNavigateBack } from './handlers/navigate.js';
import { handleSnapshot } from './handlers/snapshot.js';
import { handleClick } from './handlers/click.js';
import { handleType } from './handlers/type.js';
import { handleClose } from './handlers/close.js';
import { handleHover } from './handlers/hover.js';
import { handleDrag } from './handlers/drag.js';
import { handlePressKey } from './handlers/pressKey.js';
import { handleSelectOption } from './handlers/selectOption.js';
import { handleFillForm } from './handlers/fillForm.js';
import { handleDialog } from './handlers/dialog.js';
import { handleFileUpload } from './handlers/fileUpload.js';
import { handleEvaluate } from './handlers/evaluate.js';
import { handleRunCode } from './handlers/runCode.js';
import { handleWaitFor } from './handlers/waitFor.js';
import { handleScreenshot } from './handlers/screenshot.js';
import { handleNetworkRequests } from './handlers/networkRequests.js';
import { handleConsoleMessages } from './handlers/consoleMessages.js';
import { handleTabs } from './handlers/tabs.js';
import { handleResize } from './handlers/resize.js';
import { handleInstall } from './handlers/install.js';

type ToolHandler = (
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
) => Promise<ToolResult>;

const handlers: Record<ToolName, ToolHandler> = {
  browser_navigate: handleNavigate,
  browser_navigate_back: handleNavigateBack,
  browser_snapshot: handleSnapshot,
  browser_click: handleClick,
  browser_type: handleType,
  browser_hover: handleHover,
  browser_drag: handleDrag,
  browser_press_key: handlePressKey,
  browser_select_option: handleSelectOption,
  browser_fill_form: handleFillForm,
  browser_handle_dialog: handleDialog,
  browser_file_upload: handleFileUpload,
  browser_evaluate: handleEvaluate,
  browser_run_code: handleRunCode,
  browser_wait_for: handleWaitFor,
  browser_take_screenshot: handleScreenshot,
  browser_network_requests: handleNetworkRequests,
  browser_console_messages: handleConsoleMessages,
  browser_tabs: handleTabs,
  browser_resize: handleResize,
  browser_close: handleClose,
  browser_install: handleInstall,
};

export async function handleTool(
  name: ToolName,
  args: Record<string, unknown>,
  browser: BrowserManager,
  config: ServerConfig
): Promise<ToolResult> {
  const handler = handlers[name];
  if (!handler) {
    return {
      content: [{ type: 'text', text: `Tool not implemented: ${name}` }],
      isError: true,
    };
  }
  return handler(args, browser, config);
}

export function textResult(text: string): ToolResult {
  return { content: [{ type: 'text', text }] };
}

export function errorResult(message: string): ToolResult {
  return { content: [{ type: 'text', text: `Error: ${message}` }], isError: true };
}
