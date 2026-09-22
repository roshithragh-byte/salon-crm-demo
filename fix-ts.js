const fs = require('fs');

function replace(file, target, replacement) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content);
}

// 1. page.tsx
replace(
  'client/src/app/page.tsx', 
  'const json = await ServicesApi.getHomeData();', 
  'const json: any = await ServicesApi.getHomeData();'
);

// 2. catalogue/[id]/page.tsx
replace(
  'client/src/app/catalogue/[id]/page.tsx', 
  'const json = await ServicesApi.getServiceDetails(resolvedParams.id);', 
  'const json: any = await ServicesApi.getServiceDetails(resolvedParams.id);'
);
replace(
  'client/src/app/catalogue/[id]/page.tsx',
  '(addon: { addonService: { id: string; name: string; description: string; price: number; duration: number } })',
  '(addon: any)'
);

// 3. auth.ts
replace(
  'client/src/lib/auth.ts',
  'async jwt(params: { token: JWT; user: User; account?: unknown; profile?: unknown; }) {',
  'async jwt(params: any) {'
);
replace(
  'client/src/lib/auth.ts',
  'async session(params: { session: Session; token: JWT; user: unknown; newSession?: unknown; trigger?: string }) {',
  'async session(params: any) {'
);

// 4. bookings/page.tsx
replace(
  'client/src/app/admin/bookings/page.tsx',
  'onValueChange={val => setNewBooking({...newBooking, serviceId: val})}',
  'onValueChange={(val: any) => setNewBooking({...newBooking, serviceId: val})}'
);
replace(
  'client/src/app/admin/bookings/page.tsx',
  'onValueChange={val => setNewBooking({...newBooking, staffId: val})}',
  'onValueChange={(val: any) => setNewBooking({...newBooking, staffId: val})}'
);

console.log("Fixes applied!");
