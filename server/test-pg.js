const { PrismaPg } = require('@prisma/adapter-pg');
try {
  const adapter = new PrismaPg({ connectionString: 'postgres://dummy' });
  console.log("No error on construction");
  // Let's mock the methods it expects to see what happens
  if (typeof adapter.queryRaw === 'function') {
    console.log("Has queryRaw");
  }
} catch (e) {
  console.error("Error:", e);
}
