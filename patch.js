const fs = require('fs');

let content = fs.readFileSync('client/src/app/appointments/BookingForm.tsx', 'utf8');

// 1. Fix Service ID showing instead of Name
content = content.replace(
  /<SelectTrigger><SelectValue placeholder="Select a service" \/><\/SelectTrigger>/g,
  `<SelectTrigger>
                <SelectValue placeholder="Select a service">
                  {services.find((s: Service) => s.id === field.value)?.name || "Select a service"}
                </SelectValue>
              </SelectTrigger>`
);

// 2. Fix Staff ID showing instead of Name
content = content.replace(
  /<SelectTrigger><SelectValue placeholder="Any Available Stylist" \/><\/SelectTrigger>/g,
  `<SelectTrigger>
                <SelectValue placeholder="Any Available Stylist">
                  {field.value === "any" ? "Any Available Stylist" : staff.find((s: Staff) => s.id === field.value)?.name || "Any Available Stylist"}
                </SelectValue>
              </SelectTrigger>`
);

// 3. Update Success UI to show confirmation details
const oldSuccess = `  if (result?.success) {
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-serif font-bold text-slate-800">Request Received!</h2>
        <p className="text-slate-500 max-w-sm">
          Thank you! We&apos;ve received your appointment request. We&apos;ll confirm your booking shortly.
        </p>
        <Button variant="outline" onClick={() => setResult(null)} className="mt-2">
          Book Another Appointment
        </Button>
      </div>
    );
  }`;

const newSuccess = `  if (result?.success) {
    const email = getValues('customerEmail');
    const phone = getValues('customerPhone');
    return (
      <div className="flex flex-col items-center text-center py-8 gap-4">
        <CheckCircle2 className="w-16 h-16 text-green-500" />
        <h2 className="text-2xl font-serif font-bold text-slate-800">Booking Confirmed!</h2>
        <div className="bg-slate-50 border border-slate-100 p-5 rounded-xl w-full text-left space-y-3 mt-2 mb-2">
          <p className="text-slate-700"><span className="font-semibold text-purple-950">Phone / WhatsApp:</span> {phone}</p>
          {email && <p className="text-slate-700"><span className="font-semibold text-purple-950">Email:</span> {email}</p>}
        </div>
        <p className="text-slate-500 max-w-sm text-sm">
          Thank you! We have received your appointment request. An order confirmation will be sent to the contact details provided above.
        </p>
        <Button variant="outline" onClick={() => { reset(); setResult(null); }} className="mt-4">
          Book Another Appointment
        </Button>
      </div>
    );
  }`;

content = content.replace(oldSuccess, newSuccess);

fs.writeFileSync('client/src/app/appointments/BookingForm.tsx', content);
