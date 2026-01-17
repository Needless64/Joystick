// Simple polling-based communication for Vercel
// Since serverless functions don't maintain state, we'll use a simple polling approach

let messages = [];
let lastCleanup = Date.now();

// Simple cleanup every 5 minutes
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup > 300000) { // 5 minutes
    messages = messages.filter(msg => now - msg.timestamp < 60000); // Keep messages for 1 minute
    lastCleanup = now;
  }
}

export default function handler(req, res) {
  cleanup();
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { role } = req.query;

  if (req.method === 'GET') {
    if (role === 'desktop') {
      // Desktop polling for messages
      const recentMessages = messages.filter(msg => 
        Date.now() - msg.timestamp < 5000 && // Last 5 seconds
        msg.target === 'desktop'
      );
      
      res.status(200).json({ 
        messages: recentMessages,
        timestamp: Date.now()
      });
    } else {
      // Mobile just gets connection status
      res.status(200).json({ 
        status: 'connected',
        timestamp: Date.now()
      });
    }
  } else if (req.method === 'POST') {
    // Handle messages from mobile clients
    const body = req.body;
    
    if (role === 'mobile' && body.message) {
      // Store message for desktop clients
      messages.push({
        ...body.message,
        target: 'desktop',
        timestamp: Date.now(),
        id: Math.random().toString(36)
      });
      
      // Keep only recent messages
      messages = messages.filter(msg => Date.now() - msg.timestamp < 60000);
    }

    res.status(200).json({ success: true });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}