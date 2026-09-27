const fs = require('fs');
let content = fs.readFileSync('client/src/lib/api/services.ts', 'utf8');

// The file currently exports CustomerApi for the user (me/appointments)
// export const CustomerApi = {
//   getAppointments: () => ApiClient.get<{ upcoming: any[]; history: any[] }>('/me/appointments', true, { cache: 'no-store' }),
// };

// Let's add AdminCustomerApi for the CRM!
const newApi = `
export const AdminCustomerApi = {
  getCustomers: (salonId = 'hq') => ApiClient.get<{ data: any[] }>(\`/salons/\${salonId}/customers\`, true, { cache: 'no-store' }),
};
`;

content += newApi;
fs.writeFileSync('client/src/lib/api/services.ts', content);
