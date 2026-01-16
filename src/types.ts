/**
 * Configuration options for the Camoufox MCP server
 */
export interface ServerConfig {
  // Browser options
  headless: boolean;
  userDataDir?: string;
  
  // Camoufox specific options
  geoip: boolean | string;
  humanize: boolean | number;
  blockWebrtc: boolean;
  blockImages: boolean;
  disableCoop: boolean;
  proxy?: string;
  
  // Timeout options
  actionTimeout: number;
  navigationTimeout: number;
  
  // Output options
  outputDir: string;
  
  // Feature flags
  enableRunCode: boolean;
}

export const DEFAULT_CONFIG: ServerConfig = {
  headless: false,
  geoip: false,
  humanize: false,
  blockWebrtc: false,
  blockImages: false,
  disableCoop: false,
  actionTimeout: 5000,
  navigationTimeout: 60000,
  outputDir: '.',
  enableRunCode: false,
};

/**
 * Tool result structure
 */
export interface ToolResult {
  content: Array<{
    type: 'text' | 'image';
    text?: string;
    data?: string;
    mimeType?: string;
  }>;
  isError?: boolean;
}

/**
 * Ref structure for element identification
 */
export interface RefData {
  v: 1;
  role: string;
  name: string | null;
  nth: number;
  frameIndex?: number;
  fallback?: {
    css?: string;
    testId?: string;
  };
}

/**
 * Console message structure
 */
export interface ConsoleMessage {
  type: string;
  text: string;
  location?: string;
  timestamp: number;
}

/**
 * Network request structure
 */
export interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  type: string;
  timestamp: number;
}
