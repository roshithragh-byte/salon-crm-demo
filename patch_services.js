const fs = require('fs');
let content = fs.readFileSync('client/src/lib/api/services.ts', 'utf8');

// replace createBooking: (salonId: string, data: BookingData) => ApiClient.post<{ data: BookingData & { id: string } }>(`/salons/${salonId}/bookings`, data, true),
// with requiresAuth = false
content = content.replace(
  /createBooking: \(salonId: string, data: BookingData\) => ApiClient.post<\{ data: BookingData & \{ id: string \} \}>\(\`\/salons\/\$\{salonId\}\/bookings\`, data, true\),/g,
  `createBooking: (salonId: string, data: BookingData) => ApiClient.post<{ data: BookingData & { id: string } }>(\`/salons/\${salonId}/bookings\`, data, false),`
);

fs.writeFileSync('client/src/lib/api/services.ts', content);
