#!/usr/bin/env node

import { Camoufox } from 'camoufox-js';

async function smokeTest() {
  console.log('🦊 Camoufox MCP Server - Smoke Test\n');

  console.log('1. Testing Camoufox browser launch...');
  let browser;
  try {
    browser = await Camoufox({ headless: true });
    console.log('   ✅ Browser launched successfully');
  } catch (error) {
    console.log('   ❌ Browser launch failed:', error instanceof Error ? error.message : error);
    console.log('\n   💡 Run: npx camoufox-js fetch');
    process.exit(1);
  }

  console.log('2. Testing page creation...');
  const page = await browser.newPage();
  console.log('   ✅ Page created');

  console.log('3. Testing navigation...');
  await page.goto('https://example.com');
  const title = await page.title();
  console.log(`   ✅ Navigated to example.com (title: "${title}")`);

  console.log('4. Testing accessibility snapshot...');
  const snapshot = await (page as unknown as { accessibility: { snapshot: () => Promise<unknown> } }).accessibility.snapshot();
  console.log(`   ✅ Snapshot captured (${JSON.stringify(snapshot).length} bytes)`);

  console.log('5. Testing screenshot...');
  const screenshot = await page.screenshot({ type: 'png' });
  console.log(`   ✅ Screenshot taken (${screenshot.length} bytes)`);

  console.log('6. Testing browser close...');
  await browser.close();
  console.log('   ✅ Browser closed\n');

  console.log('🎉 All smoke tests passed!\n');
  console.log('You can now use the MCP server:');
  console.log('  npx @anthropic/mcp-server-camoufox\n');
}

smokeTest().catch((error) => {
  console.error('❌ Smoke test failed:', error);
  process.exit(1);
});
