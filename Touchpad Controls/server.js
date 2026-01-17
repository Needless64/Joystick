const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const url = require('url');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

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
  console.log(`Mobile Touchpad Controller running on port ${PORT}`);
  console.log(`Desktop: http://localhost:${PORT}/controller`);
  console.log(`Mobile: http://YOUR-IP:${PORT}/mobile`);
});