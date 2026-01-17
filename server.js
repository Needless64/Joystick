const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const url = require('url');

const app = express();

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes for different pages
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

app.get('/controller', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

app.get('/mobile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'mobile.html'));
});

app.get('/desktop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'desktop.html'));
});

// Root route - serve a landing page
app.get('/', (req, res) => {
  res.send(`
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
            <a href="/mobile" class="btn">📱 Mobile Controller</a>
            <a href="/controller" class="btn">🖥️ Desktop Receiver</a>
            <a href="/test" class="btn">🧪 Test Page</a>
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
                <p>Instant WebSocket communication for responsive control</p>
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
});

// For Vercel deployment, we need to handle WebSocket differently
// Since Vercel doesn't support WebSocket servers directly, we'll use a different approach
let server;
let wss;

if (process.env.NODE_ENV !== 'production') {
  // Local development with WebSocket support
  server = http.createServer(app);
  wss = new WebSocket.Server({ server });

  const clients = {
    mobile: [],
    desktop: []
  };

  wss.on('connection', (ws, req) => {
    const query = url.parse(req.url, true).query;
    const role = query.role;

    if (role === 'mobile') {
      clients.mobile.push(ws);
      console.log('Mobile client connected');
    } else if (role === 'desktop') {
      clients.desktop.push(ws);
      console.log('Desktop client connected');
    }

    ws.on('message', (data) => {
      if (role === 'mobile') {
        const message = JSON.parse(data);
        clients.desktop.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      }
    });

    ws.on('close', () => {
      if (role === 'mobile') {
        const index = clients.mobile.indexOf(ws);
        if (index > -1) clients.mobile.splice(index, 1);
        console.log('Mobile client disconnected');
      } else if (role === 'desktop') {
        const index = clients.desktop.indexOf(ws);
        if (index > -1) clients.desktop.splice(index, 1);
        console.log('Desktop client disconnected');
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(\`Mobile Touchpad Controller running on port \${PORT}\`);
    console.log(\`Desktop: http://localhost:\${PORT}/controller\`);
    console.log(\`Mobile: http://YOUR-IP:\${PORT}/mobile\`);
  });
} else {
  // Production mode for Vercel
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(\`Mobile Touchpad Controller running on port \${PORT}\`);
  });
}

// Export for Vercel
module.exports = app;