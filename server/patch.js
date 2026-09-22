const fs = require('fs');
const file = 'src/auth/auth.service.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  `    const primaryMembership = user.salonMembers[0];
    
    if (!primaryMembership || !primaryMembership.isActive) {
      throw new UnauthorizedException("No active salon membership found");
    }

    return {
      id: user.id,
      email: user.email,
      name: \`\${user.firstName} \${user.lastName}\`,
      role: primaryMembership.role,
      salonId: primaryMembership.salonId
    };`,
  `    const primaryMembership = user.salonMembers.find(m => m.isActive);
    let role = "CUSTOMER";
    let salonId = null;

    if (primaryMembership) {
      role = primaryMembership.role;
      salonId = primaryMembership.salonId;
    }

    return {
      id: user.id,
      email: user.email,
      name: \`\${user.firstName} \${user.lastName}\`,
      role,
      salonId
    };`
);
fs.writeFileSync(file, code);
