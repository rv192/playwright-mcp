# Camoufox MCP Server

Playwright MCP server powered by [Camoufox](https://camoufox.com/) anti-detect browser.

## Features

- **Anti-detect browser**: Uses Camoufox (modified Firefox) for stealth browsing
- **Full Playwright API**: All standard browser automation tools
- **GeoIP spoofing**: Match geolocation with proxy IP
- **Humanized cursor**: Natural mouse movements
- **WebRTC blocking**: Prevent IP leaks
- **MCP compatible**: Works with Claude Desktop, Cursor, opencode, etc.

## Requirements

- Node.js >= 20
- First run will download Camoufox browser (~150MB)

## Installation

```bash
# Install globally
npm install -g @anthropic/mcp-server-camoufox

# Or run directly with npx
npx @anthropic/mcp-server-camoufox
```

## MCP Client Configuration

### Claude Desktop / Cursor / opencode

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "camoufox": {
      "command": "npx",
      "args": ["@anthropic/mcp-server-camoufox"]
    }
  }
}
```

### With options (headless + proxy + geoip)

```json
{
  "mcpServers": {
    "camoufox": {
      "command": "npx",
      "args": [
        "@anthropic/mcp-server-camoufox",
        "--headless",
        "--proxy-server", "http://user:pass@proxy.example.com:8080",
        "--geoip"
      ]
    }
  }
}
```

## CLI Options

```
--headless                 Run browser in headless mode (default: false)
--user-data-dir <path>     Path to user data directory for persistent sessions
--geoip [ip]               Enable GeoIP spoofing (auto-detect or specify IP)
--humanize [seconds]       Humanize cursor movement (true or max duration)
--block-webrtc             Block WebRTC entirely
--block-images             Block all images (saves bandwidth)
--disable-coop             Disable Cross-Origin-Opener-Policy (for Cloudflare)
--proxy-server <url>       Proxy server URL
--timeout-action <ms>      Action timeout (default: 5000)
--timeout-navigation <ms>  Navigation timeout (default: 60000)
--output-dir <path>        Output directory for screenshots/files
--enable-run-code          Enable browser_run_code tool (security risk)
```

## Available Tools

### Navigation
- `browser_navigate` - Navigate to a URL
- `browser_navigate_back` - Go back
- `browser_wait_for` - Wait for text/time

### Interaction
- `browser_click` - Click an element
- `browser_type` - Type text into an element
- `browser_hover` - Hover over an element
- `browser_drag` - Drag and drop
- `browser_press_key` - Press a keyboard key
- `browser_select_option` - Select dropdown option
- `browser_fill_form` - Fill multiple form fields

### Observation
- `browser_snapshot` - Get accessibility tree (for element refs)
- `browser_take_screenshot` - Take a screenshot
- `browser_console_messages` - Get console logs
- `browser_network_requests` - Get network requests
- `browser_evaluate` - Run JavaScript

### Browser Management
- `browser_tabs` - List/create/close/select tabs
- `browser_resize` - Resize window
- `browser_close` - Close browser
- `browser_install` - Install Camoufox browser

### Advanced
- `browser_handle_dialog` - Handle alerts/confirms/prompts
- `browser_file_upload` - Upload files
- `browser_run_code` - Run Playwright code (requires --enable-run-code)

## Example Usage

Once connected, you can ask your AI assistant to:

```
Navigate to https://example.com and take a screenshot
```

```
Fill out the login form with username "test" and password "secret", then click submit
```

```
Wait for the text "Welcome" to appear, then capture a snapshot of the page
```

## Anti-Detection Tips

For maximum stealth:

```json
{
  "mcpServers": {
    "camoufox": {
      "command": "npx",
      "args": [
        "@anthropic/mcp-server-camoufox",
        "--proxy-server", "http://your-proxy:8080",
        "--geoip",
        "--humanize",
        "--disable-coop"
      ]
    }
  }
}
```

- `--geoip`: Matches browser timezone/locale with proxy IP location
- `--humanize`: Natural mouse movements instead of instant teleportation
- `--disable-coop`: Required for Cloudflare Turnstile

## License

Apache-2.0

## Credits

- [Camoufox](https://github.com/daijro/camoufox) - Anti-detect Firefox browser
- [camoufox-js](https://github.com/apify/camoufox-js) - JavaScript bindings
- [Playwright](https://playwright.dev/) - Browser automation framework
