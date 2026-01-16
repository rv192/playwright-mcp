import { z } from 'zod';

export const RefSchema = z.string().describe('Element reference from browser_snapshot');

export const TOOL_SCHEMAS = {
  browser_navigate: z.object({
    url: z.string().describe('The URL to navigate to'),
  }),

  browser_navigate_back: z.object({}),

  browser_snapshot: z.object({
    filename: z.string().optional().describe('Save snapshot to markdown file'),
  }),

  browser_click: z.object({
    element: z.string().describe('Human-readable element description'),
    ref: RefSchema,
    doubleClick: z.boolean().optional().describe('Whether to double click'),
    button: z.enum(['left', 'right', 'middle']).optional(),
    modifiers: z.array(z.enum(['Alt', 'Control', 'ControlOrMeta', 'Meta', 'Shift'])).optional(),
  }),

  browser_type: z.object({
    element: z.string().describe('Human-readable element description'),
    ref: RefSchema,
    text: z.string().describe('Text to type'),
    submit: z.boolean().optional().describe('Press Enter after typing'),
    slowly: z.boolean().optional().describe('Type one character at a time'),
  }),

  browser_hover: z.object({
    element: z.string().describe('Human-readable element description'),
    ref: RefSchema,
  }),

  browser_drag: z.object({
    startElement: z.string().describe('Source element description'),
    startRef: RefSchema,
    endElement: z.string().describe('Target element description'),
    endRef: RefSchema,
  }),

  browser_press_key: z.object({
    key: z.string().describe('Key name like ArrowLeft or a'),
  }),

  browser_select_option: z.object({
    element: z.string().describe('Human-readable element description'),
    ref: RefSchema,
    values: z.array(z.string()).describe('Values to select'),
  }),

  browser_fill_form: z.object({
    fields: z.array(z.object({
      name: z.string(),
      type: z.enum(['textbox', 'checkbox', 'radio', 'combobox', 'slider']),
      ref: RefSchema,
      value: z.string(),
    })),
  }),

  browser_handle_dialog: z.object({
    accept: z.boolean().describe('Whether to accept the dialog'),
    promptText: z.string().optional().describe('Text for prompt dialog'),
  }),

  browser_file_upload: z.object({
    paths: z.array(z.string()).optional().describe('Absolute file paths to upload'),
  }),

  browser_evaluate: z.object({
    function: z.string().describe('JavaScript function to evaluate'),
    element: z.string().optional(),
    ref: RefSchema.optional(),
  }),

  browser_run_code: z.object({
    code: z.string().describe('Playwright code snippet: async (page) => { ... }'),
  }),

  browser_wait_for: z.object({
    time: z.number().optional().describe('Time to wait in seconds'),
    text: z.string().optional().describe('Text to wait for'),
    textGone: z.string().optional().describe('Text to wait to disappear'),
  }),

  browser_take_screenshot: z.object({
    type: z.enum(['png', 'jpeg']).optional().default('png'),
    filename: z.string().optional(),
    element: z.string().optional(),
    ref: RefSchema.optional(),
    fullPage: z.boolean().optional(),
  }),

  browser_network_requests: z.object({
    includeStatic: z.boolean().optional().default(false),
  }),

  browser_console_messages: z.object({
    level: z.enum(['error', 'warning', 'info', 'debug']).optional().default('info'),
  }),

  browser_tabs: z.object({
    action: z.enum(['list', 'new', 'close', 'select']),
    index: z.number().optional(),
  }),

  browser_resize: z.object({
    width: z.number(),
    height: z.number(),
  }),

  browser_close: z.object({}),

  browser_install: z.object({}),
} as const;

export type ToolName = keyof typeof TOOL_SCHEMAS;

export const TOOL_DESCRIPTIONS: Record<ToolName, string> = {
  browser_navigate: 'Navigate to a URL',
  browser_navigate_back: 'Go back to the previous page',
  browser_snapshot: 'Capture accessibility snapshot of the current page',
  browser_click: 'Perform click on a web page element',
  browser_type: 'Type text into editable element',
  browser_hover: 'Hover over element on page',
  browser_drag: 'Perform drag and drop between two elements',
  browser_press_key: 'Press a key on the keyboard',
  browser_select_option: 'Select an option in a dropdown',
  browser_fill_form: 'Fill multiple form fields',
  browser_handle_dialog: 'Handle a dialog (alert/confirm/prompt)',
  browser_file_upload: 'Upload one or multiple files',
  browser_evaluate: 'Evaluate JavaScript expression on page or element',
  browser_run_code: 'Run Playwright code snippet (requires --enable-run-code)',
  browser_wait_for: 'Wait for text to appear/disappear or time to pass',
  browser_take_screenshot: 'Take a screenshot of the current page',
  browser_network_requests: 'Returns all network requests since loading the page',
  browser_console_messages: 'Returns all console messages',
  browser_tabs: 'List, create, close, or select a browser tab',
  browser_resize: 'Resize the browser window',
  browser_close: 'Close the browser',
  browser_install: 'Install the Camoufox browser',
};
