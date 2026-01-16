#!/usr/bin/env node

import { program } from 'commander';
import { CamoufoxMCPServer } from './server.js';
import { DEFAULT_CONFIG, type ServerConfig } from './types.js';

const packageJson = { version: '0.1.0' };

program
  .name('mcp-server-camoufox')
  .description('Playwright MCP server powered by Camoufox anti-detect browser')
  .version(packageJson.version)
  .option('--headless', 'Run browser in headless mode', DEFAULT_CONFIG.headless)
  .option('--user-data-dir <path>', 'Path to user data directory')
  .option('--geoip [ip]', 'Enable GeoIP spoofing (optionally specify target IP)')
  .option('--humanize [seconds]', 'Humanize cursor movement')
  .option('--block-webrtc', 'Block WebRTC entirely', DEFAULT_CONFIG.blockWebrtc)
  .option('--block-images', 'Block all images', DEFAULT_CONFIG.blockImages)
  .option('--disable-coop', 'Disable Cross-Origin-Opener-Policy', DEFAULT_CONFIG.disableCoop)
  .option('--proxy-server <url>', 'Proxy server URL')
  .option('--timeout-action <ms>', 'Action timeout in milliseconds', String(DEFAULT_CONFIG.actionTimeout))
  .option('--timeout-navigation <ms>', 'Navigation timeout in milliseconds', String(DEFAULT_CONFIG.navigationTimeout))
  .option('--output-dir <path>', 'Output directory for files', DEFAULT_CONFIG.outputDir)
  .option('--enable-run-code', 'Enable browser_run_code tool (security risk)', DEFAULT_CONFIG.enableRunCode)
  .action(async (options) => {
    const config: ServerConfig = {
      headless: options.headless ?? DEFAULT_CONFIG.headless,
      userDataDir: options.userDataDir,
      geoip: parseGeoip(options.geoip),
      humanize: parseHumanize(options.humanize),
      blockWebrtc: options.blockWebrtc ?? DEFAULT_CONFIG.blockWebrtc,
      blockImages: options.blockImages ?? DEFAULT_CONFIG.blockImages,
      disableCoop: options.disableCoop ?? DEFAULT_CONFIG.disableCoop,
      proxy: options.proxyServer,
      actionTimeout: parseInt(options.timeoutAction, 10) || DEFAULT_CONFIG.actionTimeout,
      navigationTimeout: parseInt(options.timeoutNavigation, 10) || DEFAULT_CONFIG.navigationTimeout,
      outputDir: options.outputDir ?? DEFAULT_CONFIG.outputDir,
      enableRunCode: options.enableRunCode ?? DEFAULT_CONFIG.enableRunCode,
    };

    const server = new CamoufoxMCPServer(config);

    process.on('SIGINT', async () => {
      await server.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await server.close();
      process.exit(0);
    });

    await server.run();
  });

function parseGeoip(value: string | boolean | undefined): boolean | string {
  if (value === undefined) return false;
  if (value === true || value === 'true') return true;
  if (typeof value === 'string' && value.length > 0) return value;
  return false;
}

function parseHumanize(value: string | boolean | undefined): boolean | number {
  if (value === undefined) return false;
  if (value === true || value === 'true') return true;
  const num = parseFloat(String(value));
  if (!isNaN(num)) return num;
  return false;
}

program.parse();
