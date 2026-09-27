const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/salons/hq/bookings',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'idempotency-key': 'test-123'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});

req.on('error', console.error);
req.write(JSON.stringify({
  customerName: 'Test User',
  customerPhone: '1234567890',
  serviceId: 'test-service-id',
  startsAt: new Date().toISOString()
}));
req.end();
