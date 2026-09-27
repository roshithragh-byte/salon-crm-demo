const fs = require('fs');
let content = fs.readFileSync('client/src/app/appointments/page.tsx', 'utf8');

// The original page.tsx was Server Component that fetched services and staff, and passed it to BookingForm.
// Since my new BookingForm handles fetching, I don't need to pass them.

content = content.replace(/<BookingForm services={services} staff={staff} \/>/g, '<BookingForm />');

fs.writeFileSync('client/src/app/appointments/page.tsx', content);
