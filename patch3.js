const fs = require('fs');

let content = fs.readFileSync('client/src/app/appointments/BookingForm.tsx', 'utf8');

content = content.replace(
  /const { register, handleSubmit, control, reset } = useForm<FormValues>\(\{/g,
  `const { register, handleSubmit, control, reset, getValues } = useForm<FormValues>({`
);

fs.writeFileSync('client/src/app/appointments/BookingForm.tsx', content);
