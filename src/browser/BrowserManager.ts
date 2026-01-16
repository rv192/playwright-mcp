import type { Browser, BrowserContext, Page, Dialog, ConsoleMessage as PWConsoleMessage, Request, Response } from 'playwright-core';
import { Camoufox } from 'camoufox-js';
import type { ServerConfig, ConsoleMessage, NetworkRequest } from '../types.js';

interface TabInfo {
  page: Page;
  url: string;
  title: string;
}

export class BrowserManager {
  private config: ServerConfig;
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private pages: Page[] = [];
  private activePageIndex = 0;
  private pendingDialog: Dialog | null = null;
  private consoleMessages: ConsoleMessage[] = [];
  private networkRequests: NetworkRequest[] = [];
  private maxMessages = 1000;

  constructor(config: ServerConfig) {
    this.config = config;
  }

  async ensureBrowser(): Promise<void> {
    if (this.browser) return;

    const launchOptions: Record<string, unknown> = {
      headless: this.config.headless,
      geoip: this.config.geoip,
      humanize: this.config.humanize,
      block_webrtc: this.config.blockWebrtc,
      block_images: this.config.blockImages,
      disable_coop: this.config.disableCoop,
    };

    if (this.config.proxy) {
      launchOptions.proxy = this.config.proxy;
    }

    if (this.config.userDataDir) {
      launchOptions.user_data_dir = this.config.userDataDir;
      const ctx = await Camoufox(launchOptions as Parameters<typeof Camoufox>[0]) as unknown as BrowserContext;
      this.context = ctx;
      this.browser = null;
      const page = ctx.pages()[0] || await ctx.newPage();
      this.pages = [page];
      this.setupPageListeners(page);
    } else {
      this.browser = await Camoufox(launchOptions as Parameters<typeof Camoufox>[0]) as unknown as Browser;
      this.context = await this.browser.newContext();
      const page = await this.context.newPage();
      this.pages = [page];
      this.setupPageListeners(page);
    }
  }

  private setupPageListeners(page: Page): void {
    page.on('console', (msg: PWConsoleMessage) => {
      this.consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location()?.url,
        timestamp: Date.now(),
      });
      if (this.consoleMessages.length > this.maxMessages) {
        this.consoleMessages.shift();
      }
    });

    page.on('request', (request: Request) => {
      this.networkRequests.push({
        url: request.url(),
        method: request.method(),
        type: request.resourceType(),
        timestamp: Date.now(),
      });
      if (this.networkRequests.length > this.maxMessages) {
        this.networkRequests.shift();
      }
    });

    page.on('response', (response: Response) => {
      const url = response.url();
      const existing = this.networkRequests.find(r => r.url === url && !r.status);
      if (existing) {
        existing.status = response.status();
      }
    });

    page.on('dialog', (dialog: Dialog) => {
      this.pendingDialog = dialog;
    });
  }

  async getPage(): Promise<Page> {
    await this.ensureBrowser();
    return this.pages[this.activePageIndex];
  }

  async navigate(url: string): Promise<void> {
    const page = await this.getPage();
    await page.goto(url, { timeout: this.config.navigationTimeout });
  }

  async goBack(): Promise<void> {
    const page = await this.getPage();
    await page.goBack({ timeout: this.config.navigationTimeout });
  }

  async newTab(): Promise<number> {
    await this.ensureBrowser();
    const ctx = this.context || (this.browser ? await this.browser.newContext() : null);
    if (!ctx) throw new Error('No browser context available');
    
    const page = await ctx.newPage();
    this.pages.push(page);
    this.setupPageListeners(page);
    this.activePageIndex = this.pages.length - 1;
    return this.activePageIndex;
  }

  async closeTab(index?: number): Promise<void> {
    const targetIndex = index ?? this.activePageIndex;
    if (targetIndex < 0 || targetIndex >= this.pages.length) {
      throw new Error(`Invalid tab index: ${targetIndex}`);
    }

    const page = this.pages[targetIndex];
    await page.close();
    this.pages.splice(targetIndex, 1);

    if (this.pages.length === 0) {
      await this.newTab();
    }
    
    if (this.activePageIndex >= this.pages.length) {
      this.activePageIndex = this.pages.length - 1;
    }
  }

  async selectTab(index: number): Promise<void> {
    if (index < 0 || index >= this.pages.length) {
      throw new Error(`Invalid tab index: ${index}`);
    }
    this.activePageIndex = index;
  }

  async listTabs(): Promise<TabInfo[]> {
    return Promise.all(
      this.pages.map(async (page) => ({
        page,
        url: page.url(),
        title: await page.title(),
      }))
    );
  }

  async resize(width: number, height: number): Promise<void> {
    const page = await this.getPage();
    await page.setViewportSize({ width, height });
  }

  getPendingDialog(): Dialog | null {
    return this.pendingDialog;
  }

  clearPendingDialog(): void {
    this.pendingDialog = null;
  }

  getConsoleMessages(level: string): ConsoleMessage[] {
    const levels: Record<string, string[]> = {
      error: ['error'],
      warning: ['error', 'warning'],
      info: ['error', 'warning', 'info', 'log'],
      debug: ['error', 'warning', 'info', 'log', 'debug', 'trace'],
    };
    const allowed = levels[level] || levels.info;
    return this.consoleMessages.filter(m => allowed.includes(m.type));
  }

  getNetworkRequests(includeStatic: boolean): NetworkRequest[] {
    if (includeStatic) return [...this.networkRequests];
    
    const staticTypes = ['image', 'font', 'stylesheet', 'media'];
    return this.networkRequests.filter(r => !staticTypes.includes(r.type));
  }

  async close(): Promise<void> {
    try {
      if (this.context) {
        await this.context.close();
      }
      if (this.browser) {
        await this.browser.close();
      }
    } catch {
      // Ignore errors during cleanup
    }
    this.browser = null;
    this.context = null;
    this.pages = [];
    this.activePageIndex = 0;
  }

  getConfig(): ServerConfig {
    return this.config;
  }
}
