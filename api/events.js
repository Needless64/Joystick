// Message queue system for mobile-desktop communication
let messageQueue = [];
let lastCleanup = Date.now();

// Clean old messages (older than 30 seconds)
function cleanupMessages() {
  const now = Date.now();
  if (now - lastCleanup > 5000) { // Cleanup every 5 seconds
    messageQueue = messageQueue.filter(msg => now - msg.timestamp < 30000);
    lastCleanup = now;
  }
}

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  cleanupMessages();

  const role = req.query.role || 'none';

  try {
    if (req.method === 'POST') {
      // Mobile sending data to desktop
      if (role === 'mobile') {
        const { message } = req.body;
        if (message) {
          messageQueue.push({
            ...message,
            timestamp: Date.now(),
            id: Math.random().toString(36).substr(2, 9)
          });
          
          res.status(200).json({ 
            success: true, 
            message: 'Data sent to desktop',
            queueSize: messageQueue.length
          });
        } else {
          res.status(400).json({ success: false, error: 'No message provided' });
        }
      } else {
        res.status(400).json({ success: false, error: 'Invalid role for POST' });
      }
    } else if (req.method === 'GET') {
      // Desktop polling for messages
      if (role === 'desktop') {
        const messages = [...messageQueue];
        messageQueue = []; // Clear queue after sending
        
        res.status(200).json({
          success: true,
          messages: messages,
          timestamp: Date.now()
        });
      } else if (role === 'mobile') {
        // Mobile checking connection
        res.status(200).json({
          success: true,
          message: 'Mobile connection OK',
          timestamp: Date.now(),
          queueSize: messageQueue.length
        });
      } else {
        res.status(200).json({
          success: true,
          message: 'Events API working',
          method: req.method,
          role: role,
          queueSize: messageQueue.length
        });
      }
    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}