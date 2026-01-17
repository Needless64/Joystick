// Server-Sent Events endpoint for real-time communication
// This replaces WebSocket for Vercel deployment

let clients = {
  mobile: [],
  desktop: []
};

// Clean up disconnected clients periodically
setInterval(() => {
  clients.mobile = clients.mobile.filter(client => !client.res.destroyed);
  clients.desktop = clients.desktop.filter(client => !client.res.destroyed);
}, 30000);

export default function handler(req, res) {
  const { role } = req.query;

  if (req.method === 'GET') {
    // Server-Sent Events connection
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const clientId = Date.now() + Math.random();
    const client = { id: clientId, res, lastSeen: Date.now() };

    if (role === 'mobile') {
      clients.mobile.push(client);
      console.log('Mobile client connected via SSE');
    } else if (role === 'desktop') {
      clients.desktop.push(client);
      console.log('Desktop client connected via SSE');
    }

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: 'connected', role })}\n\n`);

    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (!res.destroyed) {
        res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
      } else {
        clearInterval(keepAlive);
      }
    }, 25000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
      if (role === 'mobile') {
        clients.mobile = clients.mobile.filter(c => c.id !== clientId);
        console.log('Mobile client disconnected');
      } else if (role === 'desktop') {
        clients.desktop = clients.desktop.filter(c => c.id !== clientId);
        console.log('Desktop client disconnected');
      }
    });

  } else if (req.method === 'POST') {
    // Handle messages from mobile clients
    const { message } = req.body;
    
    if (role === 'mobile' && message) {
      // Broadcast to all desktop clients
      clients.desktop.forEach(client => {
        if (!client.res.destroyed) {
          try {
            client.res.write(`data: ${JSON.stringify(message)}\n\n`);
          } catch (error) {
            console.error('Error sending to desktop client:', error);
          }
        }
      });
    }

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}