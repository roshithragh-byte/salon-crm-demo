const fs = require('fs');

// 1. src/app/admin/bookings/page.tsx
let bPage = fs.readFileSync('client/src/app/admin/bookings/page.tsx', 'utf8');
bPage = bPage.replace(/BookingApi/g, 'ApiClient');
bPage = bPage.replace(/import { BookingApi } from "@\/lib\/api\/services";/, 'import { ApiClient } from "@/lib/api/client";');
bPage = bPage.replace(/\(res\)/, '(res: any)');
bPage = bPage.replace(/\(err\)/, '(err: any)');
fs.writeFileSync('client/src/app/admin/bookings/page.tsx', bPage);

// 2. src/app/admin/dashboard/page.tsx
let dPage = fs.readFileSync('client/src/app/admin/dashboard/page.tsx', 'utf8');
dPage = dPage.replace(/formatter={\(value: number\) => \[`\$\{value\} bookings`, 'Count'\]}/, "formatter={(value: any) => [`${value} bookings`, 'Count']}");
fs.writeFileSync('client/src/app/admin/dashboard/page.tsx', dPage);

// 3 & 4. src/app/appointments/BookingForm.tsx
let formPage = fs.readFileSync('client/src/app/appointments/BookingForm.tsx', 'utf8');
formPage = formPage.replace(/<{ starts_at: string; ends_at: string }\[\]>/g, '<any[]>');
formPage = formPage.replace(/await BookingApi\.request<WebhookResponse>\('\/payments\/webhook\/razorpay', \{/g, `await ApiClient.post<WebhookResponse>('/payments/webhook/razorpay', {`);
formPage = formPage.replace(/method: 'POST',\s*body: JSON\.stringify\(\{ order_id: paymentJson\.data\.providerOrderId \}\)/g, `order_id: paymentJson.data.providerOrderId`);
formPage = formPage.replace(/import { BookingApi } from "@\/lib\/api\/services";/, 'import { BookingApi } from "@/lib/api/services";\nimport { ApiClient } from "@/lib/api/client";');
fs.writeFileSync('client/src/app/appointments/BookingForm.tsx', formPage);

// 5. src/app/appointments/page.tsx
let aptPage = fs.readFileSync('client/src/app/appointments/page.tsx', 'utf8');
aptPage = aptPage.replace(/import BookingForm from "\.\/BookingForm";/, 'import { BookingForm } from "./BookingForm";');
fs.writeFileSync('client/src/app/appointments/page.tsx', aptPage);

