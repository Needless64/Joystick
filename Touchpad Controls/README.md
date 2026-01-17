# 📱 Mobile Touchpad Controller

Turn your phone into a wireless touchpad and scroll wheel for your laptop! Works instantly on the same Wi-Fi network.

## ✨ Features

- **Wireless Touchpad**: Use your phone screen as a laptop touchpad
- **Scroll Control**: Dedicated joystick for smooth scrolling
- **Simultaneous Use**: Control cursor and scroll at the same time
- **Customizable**: Adjust sensitivity, layout size, and button visibility
- **Cross-Platform**: Works on Windows, Mac, and Linux
- **No Apps Required**: Pure web-based solution

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

### 3. Open Controllers
- **Desktop**: Open `http://localhost:3000/controller` on your laptop
- **Mobile**: Open `http://YOUR-IP:3000/mobile` on your phone

### 4. Activate Control
1. Drag the bookmarklet from the desktop page to your bookmarks bar
2. Go to any website (YouTube, Google, etc.)
3. Click the bookmarklet to activate control
4. Use your phone to control the laptop!

## 📱 Mobile Interface

### Controls
- **Left Side**: Joystick for scrolling pages up/down
- **Right Side**: Large touchpad for cursor control
- **Tap**: Quick tap on touchpad = left click
- **Settings**: Tap ⚙ button for customization

### Customization Options
- **Cursor Speed**: 1x-10x sensitivity
- **Scroll Speed**: 1x-10x sensitivity  
- **Layout Size**: Small/Normal/Large
- **Action Buttons**: Show/hide L/R click buttons

## 💻 Desktop Control

The bookmarklet creates a virtual cursor that:
- Moves based on your phone's touchpad input
- Clicks where you tap on the touchpad
- Scrolls pages when you use the joystick
- Works on any website

## 🔧 Technical Details

### Architecture
- **Backend**: Node.js + Express + WebSocket
- **Frontend**: Pure HTML/CSS/JavaScript
- **Communication**: Real-time WebSocket messaging
- **Compatibility**: All modern browsers

### File Structure
```
Touchpad Controls/
├── server.js              # WebSocket server
├── package.json           # Dependencies
├── public/
│   ├── mobile.html        # Phone controller interface
│   ├── controller.html    # Desktop setup page
│   └── test.html         # Testing page
├── chrome-extension/      # Chrome extension (optional)
└── README.md             # This file
```

## 🌐 Network Setup

### Find Your IP Address
**Windows:**
```bash
ipconfig
```

**Mac/Linux:**
```bash
ifconfig
```

Look for your Wi-Fi adapter's IPv4 address (usually starts with 192.168.x.x)

### Firewall
Make sure port 3000 is allowed through your firewall for local network access.

## 🎮 Usage Tips

### Best Practices
- **Same Wi-Fi**: Ensure both devices are on the same network
- **Landscape Mode**: Works great in phone landscape orientation
- **Sensitivity**: Start with default settings, adjust as needed
- **Battery**: Consider keeping phone plugged in for extended use

### Troubleshooting
- **Can't Connect**: Check if both devices are on same Wi-Fi
- **Slow Response**: Try increasing sensitivity in settings
- **Not Working**: Refresh both pages and try again

## 🔒 Security

- **Local Network Only**: Server only accepts connections from local network
- **No Data Collection**: No personal data is stored or transmitted
- **Browser Sandboxed**: All control happens within browser security limits

## 🛠️ Development

### Adding Features
1. Modify `public/mobile.html` for mobile interface changes
2. Update `server.js` for backend functionality
3. Edit `public/controller.html` for desktop setup page

### WebSocket Protocol
```javascript
// Mobile to Desktop
{ type: 'mouseMove', x: deltaX, y: deltaY, sensitivity: speed }
{ type: 'joystick', x: normalizedX, y: normalizedY }
{ type: 'click', button: 'left', action: 'tap' }

// Connection
ws://localhost:3000/?role=mobile
ws://localhost:3000/?role=desktop
```

## 📄 License

MIT License - Feel free to use, modify, and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Enjoy your wireless touchpad! 🎉**