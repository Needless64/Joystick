export default function handler(req, res) {
  res.status(200).json({
    message: 'Events API working',
    method: req.method,
    role: req.query.role || 'none'
  });
}