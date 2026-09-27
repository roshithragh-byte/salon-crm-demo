const fs = require('fs');
let content = fs.readFileSync('client/src/app/appointments/BookingForm.tsx', 'utf8');

const oldSuccess = `        <Button variant="outline" onClick={() => { reset(); setResult(null); }} className="mt-4">
          Book Another Appointment
        </Button>`;

const newSuccess = `        <Button variant="outline" onClick={() => router.push('/')} className="mt-4">
          Return to Homepage
        </Button>`;

content = content.replace(oldSuccess, newSuccess);
fs.writeFileSync('client/src/app/appointments/BookingForm.tsx', content);
