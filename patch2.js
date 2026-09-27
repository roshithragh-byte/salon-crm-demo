const fs = require('fs');

let content = fs.readFileSync('client/src/app/appointments/BookingForm.tsx', 'utf8');

// The line is: const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<FormValues>({
// Let's add getValues
content = content.replace(
  /const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<FormValues>\(\{/g,
  `const { register, handleSubmit, control, watch, reset, getValues, formState: { errors } } = useForm<FormValues>({`
);

// Note: Next.js 16.3.5 says middleware is deprecated and to use "proxy"! 
// Vercel was actually trying to use proxy.ts but it failed for another reason?
// Let's just fix getValues first.

fs.writeFileSync('client/src/app/appointments/BookingForm.tsx', content);
