// Simple message passing API for Vercel
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { role } = req.query;

    if (req.method === 'GET') {
      // Simple response for connection test
      res.status(200).json({ 
        status: 'connected',
        role: role || 'unknown',
        timestamp: Date.now(),
        message: 'API is working!'
      });
    } else if (req.method === 'POST') {
      // Handle POST requests
      res.status(200).json({ 
        success: true,
        received: req.body,
        timestamp: Date.now()
      });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}