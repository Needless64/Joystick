# 📱 Mobile Touchpad Controller

Transform your smartphone into a wireless touchpad and mouse for your laptop! Control any website, play browser games, and navigate your computer from anywhere in the room.

![Mobile Touchpad Demo](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension%20Ready-blue)
![WebSocket](https://img.shields.io/badge/WebSocket-Real%20Time-orange)
![Mobile Friendly](https://img.shields.io/badge/Mobile-Optimized-purple)

## 🚀 Features

### 📱 **Mobile Controller**
- **Virtual Joystick**: Smooth scrolling control
- **Multi-touch Touchpad**: Precise cursor movement
- **Click Support**: Left/right click with tap gestures
- **Customizable Settings**: Adjust sensitivity and layout
- **Real-time Response**: Instant WebSocket communication

### 🖥️ **Desktop Control**
- **Universal Compatibility**: Works on any website
- **Visual Feedback**: See cursor position and connection status
- **Auto-activation**: Automatically works on every Chrome tab
- **Smooth Scrolling**: Natural page navigation
- **Click Simulation**: Real mouse clicks at cursor position

### 🔌 **Chrome Extension**
- **One-click Setup**: Install and forget
- **Auto-active Mode**: Works on every tab automatically
- **Global Enable/Disable**: Easy on/off control
- **Settings Panel**: Configure server connection
- **Professional UI**: Clean, intuitive interface

## 🎮 Perfect For

- **🎯 Browser Gaming**: Control games with mobile touchpad
- **📺 Media Control**: Navigate YouTube, Netflix from couch
- **📊 Presentations**: Control slides from across the room
- **♿ Accessibility**: Alternative input method
- **🛋️ Comfort**: Control laptop from bed/couch

## 📦 What's Included

```
📁 Mobile-Touchpad-Controller/
├── 📁 chrome-extension/          # Chrome extension files
│   ├── manifest.json             # Extension configuration
│   ├── popup.html                # Extension interface
│   ├── popup.js                  # Extension logic
│   ├── content.js                # Auto-activation script
│   ├── background.js             # Extension background
│   └── 📁 icons/                 # Extension icons
├── 📁 public/                    # Web interface files
│   ├── mobile.html               # Mobile controller
│   └── controller.html           # Desktop receiver
├── server.js                     # WebSocket server
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🛠️ Quick Setup

### 1️⃣ **Install Dependencies**
```bash
git clone https://github.com/Needless64/Joystick.git
cd Joystick
npm install
```

### 2️⃣ **Start the Server**
```bash
npm start
```
Server runs on `http://localhost:3000`

### 3️⃣ **Install Chrome Extension**
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" → select `chrome-extension/` folder
4. Extension auto-activates on every tab!

### 4️⃣ **Connect Your Phone**
1. Find your computer's IP address:
   - **Windows**: `ipconfig` in Command Prompt
   - **Mac/Linux**: `ifconfig` in Terminal
2. Open `http://YOUR-IP:3000/mobile` on your phone
3. Start controlling your laptop wirelessly!

## 🎯 Usage

### **Mobile Interface**
- **Left Joystick**: Scroll webpages up/down
- **Right Touchpad**: Move cursor, tap to click
- **Settings (⚙️)**: Adjust sensitivity and layout
- **L/R Buttons**: Left/right click

### **Chrome Extension**
- **Auto-Active**: Works on every tab automatically
- **Status Indicator**: Shows connection status
- **Disable Button**: Turn off when not needed
- **Settings**: Configure server connection

## 🌐 Network Setup

### **Same WiFi Network Required**
Both devices must be connected to the same WiFi network.

### **Find Your IP Address**
```bash
# Windows
ipconfig

# Mac/Linux  
ifconfig
```
Look for your WiFi adapter's IP (usually `192.168.x.x`)

### **Example URLs**
- **Desktop**: `http://localhost:3000/controller`
- **Mobile**: `http://192.168.1.100:3000/mobile`

## 🔧 Troubleshooting

### **Extension Issues**
- ✅ Enable Developer Mode in Chrome
- ✅ Reload extension after changes
- ✅ Check for errors in extension popup

### **Connection Issues**
- ✅ Both devices on same WiFi
- ✅ Server running on port 3000
- ✅ Firewall allows connections
- ✅ Use computer's IP, not localhost on mobile

### **Control Issues**
- ✅ Extension shows "Auto-active" status
- ✅ Mobile shows "Connected" status
- ✅ Try refreshing webpage
- ✅ Check WebSocket connection

## 🔒 Privacy & Security

- **🏠 Local Network Only**: All communication stays on your WiFi
- **🚫 No Data Collection**: Doesn't track or store personal data
- **🔓 Open Source**: Full code available for review
- **⏱️ Temporary**: Only active when you enable it

## 📋 Requirements

- **Chrome Browser**: Version 88+ (Manifest V3 support)
- **Node.js**: Version 12+ for server
- **WiFi Network**: Both devices on same network
- **Modern Mobile Browser**: Chrome, Safari, Firefox mobile

## 🚀 Advanced Features

### **Multi-Tab Support**
- Control different tabs independently
- Switch between controlled tabs seamlessly
- Each tab gets its own cursor

### **Customization**
- Adjust cursor sensitivity
- Change scroll speed
- Resize mobile interface
- Configure server settings

### **Auto-Reconnection**
- Automatically reconnects if connection drops
- Persistent settings across sessions
- Robust error handling

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report Bugs**: Open an issue with details
2. **💡 Suggest Features**: Share your ideas
3. **🔧 Submit PRs**: Improve the code
4. **📖 Improve Docs**: Help others understand

## 📝 Version History

### **v2.0.0** - Auto-Active Extension
- ✨ Auto-activation on every Chrome tab
- 🎛️ Global enable/disable control
- 🔄 Improved reconnection handling
- 📱 Enhanced mobile interface

### **v1.0.0** - Initial Release
- 🎮 Basic touchpad and joystick controls
- 🔌 Chrome extension support
- 📡 WebSocket communication
- 📱 Mobile-optimized interface

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🌟 Show Your Support

If this project helped you, please ⭐ star the repository!

---

**Made with ❤️ for seamless mobile-to-desktop control**

### 📞 Need Help?

- 📖 Check the [Setup Guide](CHROME_EXTENSION_SETUP.md)
- 🐛 [Report Issues](https://github.com/Needless64/Joystick/issues)
- 💬 [Discussions](https://github.com/Needless64/Joystick/discussions)

**Happy controlling! 🎉**