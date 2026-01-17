# 🔌 Mobile Touchpad Chrome Extension

A Chrome extension that lets you control any website with your phone as a wireless touchpad - no bookmarklets needed!

## ✨ Features

- **One-click activation** on any tab
- **No bookmarklets required** - works directly from extension
- **Visual feedback** with cursor and status indicator
- **Automatic reconnection** if server goes down
- **Settings panel** for server configuration
- **Works on all websites** including restricted pages

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1. **Open Chrome Extensions page**:
   - Go to `chrome://extensions/`
   - Or Menu → More Tools → Extensions

2. **Enable Developer Mode**:
   - Toggle the "Developer mode" switch in the top-right

3. **Load the Extension**:
   - Click "Load unpacked"
   - Select the `chrome-extension` folder
   - The extension should appear in your extensions list

4. **Pin the Extension** (optional):
   - Click the puzzle piece icon in Chrome toolbar
   - Pin the "Mobile Touchpad Controller" extension

### Method 2: Package and Install

1. **Package the extension**:
   - Go to `chrome://extensions/`
   - Click "Pack extension"
   - Select the `chrome-extension` folder
   - This creates a `.crx` file

2. **Install the package**:
   - Drag the `.crx` file to Chrome
   - Click "Add extension"

## 📱 Usage

### 1. Start the Server
```bash
cd "Touchpad Controls"
npm start
```

### 2. Use the Extension

1. **Click the extension icon** in Chrome toolbar
2. **Configure server settings** if needed (default: localhost:3000)
3. **Click "Activate on This Tab"** - you'll see a blue indicator
4. **Open mobile controller** on your phone
5. **Control the tab** with your phone!

### 3. Mobile Controller

- Open the URL shown in the extension popup on your phone
- Use the touchpad and joystick to control the active Chrome tab
- The red cursor shows where your "mouse" is pointing

## 🎮 Controls

**Mobile Interface:**
- **Left joystick**: Scroll the webpage up/down
- **Right touchpad**: Move cursor, tap to click
- **Settings (⚙)**: Adjust sensitivity and layout
- **L/R buttons**: Left/right click

**Extension Popup:**
- **Activate/Deactivate**: Toggle controller for current tab
- **Open Mobile**: Launch mobile controller in new tab
- **Settings**: Configure server host and port

## ⚙️ Configuration

### Server Settings
- **Host**: Usually `localhost` or your computer's IP address
- **Port**: Default is `3000`, change if you're running server on different port

### Finding Your IP Address
**Windows**: `ipconfig` in Command Prompt
**Mac/Linux**: `ifconfig` in Terminal

Look for your Wi-Fi adapter's IP address (usually starts with 192.168.x.x)

## 🔧 Technical Details

### Extension Architecture
- **Manifest V3** - Latest Chrome extension format
- **Content Script** - Injected into all pages for communication
- **Background Script** - Handles extension lifecycle
- **Popup** - User interface for activation and settings

### Permissions
- `activeTab` - Access current tab for injection
- `scripting` - Inject touchpad controller code
- `storage` - Save user settings
- `<all_urls>` - Work on any website

### WebSocket Communication
- Connects to local server on specified host:port
- Real-time communication for mouse/scroll events
- Automatic reconnection on connection loss

## 🐛 Troubleshooting

### Extension Not Working
1. **Check server is running** - Status should show "Server running"
2. **Refresh the page** - Some sites need a refresh after activation
3. **Check permissions** - Make sure extension has access to the site
4. **Try different tab** - Some Chrome internal pages block extensions

### Mobile Controller Not Connecting
1. **Same Wi-Fi network** - Both devices must be on same network
2. **Firewall settings** - Allow port 3000 through firewall
3. **Correct IP address** - Use computer's IP, not localhost on mobile
4. **Server running** - Make sure Node.js server is active

### Cursor Not Moving
1. **Click "Activate"** - Make sure extension is active on current tab
2. **Check WebSocket** - Status should show connected
3. **Try different website** - Some sites may block mouse events
4. **Refresh page** - Sometimes helps with event handling

## 🔒 Privacy & Security

- **Local network only** - All communication stays on your Wi-Fi
- **No data collection** - Extension doesn't store or transmit personal data
- **Browser sandboxed** - All control happens within browser security limits
- **Open source** - All code is visible and auditable

## 🛠️ Development

### File Structure
```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup interface
├── popup.js              # Popup logic and UI
├── content.js            # Injected into all pages
├── background.js         # Extension background service
├── icons/                # Extension icons (16, 32, 48, 128px)
└── README.md            # This file
```

### Building Icons
Create PNG icons in the `icons/` folder:
- 16x16px for toolbar
- 32x32px for Windows
- 48x48px for extension management
- 128x128px for Chrome Web Store

### Testing
1. Load extension in developer mode
2. Test on various websites
3. Check console for errors
4. Test mobile connectivity

## 📄 License

MIT License - Feel free to modify and distribute!

---

**Enjoy wireless laptop control! 🎉**