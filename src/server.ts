import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { TOOL_SCHEMAS, TOOL_DESCRIPTIONS, type ToolName } from './tools/schema.js';
import { BrowserManager } from './browser/BrowserManager.js';
import { type ServerConfig } from './types.js';
import { zodToJsonSchema } from './utils.js';
import { handleTool } from './tools/index.js';

interface TextContent {
  type: 'text';
  text: string;
}

interface ImageContent {
  type: 'image';
  data: string;
  mimeType: string;
}

interface MCPToolResult {
  content: Array<TextContent | ImageContent>;
  isError?: boolean;
  [key: string]: unknown;
}

export class CamoufoxMCPServer {
  private server: Server;
  private browserManager: BrowserManager;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.browserManager = new BrowserManager(config);
    this.server = new Server(
      { name: 'camoufox-mcp', version: '0.1.0' },
      { capabilities: { tools: {} } }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Object.entries(TOOL_SCHEMAS).map(([name, schema]) => ({
        name,
        description: TOOL_DESCRIPTIONS[name as ToolName],
        inputSchema: zodToJsonSchema(schema),
      }));
      return { tools };
    });

    this.server.setRequestHandler(CallToolRequestSchema, (async (request: unknown): Promise<unknown> => {
      const req = request as { params: { name: string; arguments?: Record<string, unknown> } };
      const { name, arguments: args } = req.params;
      const toolName = name as ToolName;

      if (!(toolName in TOOL_SCHEMAS)) {
        return {
          content: [{ type: 'text', text: `Error: Unknown tool: ${name}` }],
          isError: true,
        } as MCPToolResult;
      }

      try {
        const result = await handleTool(
          toolName,
          args || {},
          this.browserManager,
          this.config
        );
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return {
          content: [{ type: 'text', text: `Error: ${message}` }],
          isError: true,
        } as MCPToolResult;
      }
    }) as Parameters<typeof this.server.setRequestHandler>[1]);
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async close(): Promise<void> {
    await this.browserManager.close();
    await this.server.close();
  }
}
