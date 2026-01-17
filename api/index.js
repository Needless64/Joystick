// Main serverless function for Vercel
const path = require('path');
const fs = require('fs');

export default function handler(req, res) {
  const { url, method } = req;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Route handling
  if (url === '/' || url === '') {
    // Serve landing page
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>📱 Mobile Touchpad Controller</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
        }
        .container {
            text-align: center;
            max-width: 600px;
            padding: 40px 20px;
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        h1 { font-size: 3em; margin-bottom: 20px; }
        .subtitle { font-size: 1.2em; margin-bottom: 40px; opacity: 0.9; }
        .buttons { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .btn {
            padding: 15px 30px;
            background: rgba(255,255,255,0.2);
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 10px;
            color: white;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        }
        .btn:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
            transform: translateY(-2px);
        }
        .features {
            margin-top: 40px;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            text-align: left;
        }
        .feature {
            background: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,0.2);
        }
        .feature h3 { margin-bottom: 10px; }
        .github {
            margin-top: 30px;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        .github a {
            color: white;
            text-decoration: none;
            font-weight: 600;
        }
        .github a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📱 Mobile Touchpad</h1>
        <p class="subtitle">Transform your phone into a wireless touchpad for your laptop!</p>
        
        <div class="buttons">
            <a href="/mobile.html" class="btn">📱 Mobile Controller</a>
            <a href="/controller.html" class="btn">🖥️ Desktop Receiver</a>
            <a href="/test.html" class="btn">🧪 Test Page</a>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🎮 Easy Control</h3>
                <p>Use joystick for scrolling and touchpad for cursor movement</p>
            </div>
            <div class="feature">
                <h3>🔌 Chrome Extension</h3>
                <p>Auto-activates on every tab for seamless control</p>
            </div>
            <div class="feature">
                <h3>⚡ Real-time</h3>
                <p>Instant communication for responsive control</p>
            </div>
            <div class="feature">
                <h3>⚙️ Customizable</h3>
                <p>Adjust sensitivity, layout, and button visibility</p>
            </div>
        </div>
        
        <div class="github">
            <p>🌟 <a href="https://github.com/Needless64/Joystick" target="_blank">View on GitHub</a> | 
            📖 <a href="https://github.com/Needless64/Joystick#readme" target="_blank">Documentation</a></p>
        </div>
    </div>
</body>
</html>
    `);
  } else {
    // For other routes, return 404
    res.status(404).json({ error: 'Not found' });
  }
}