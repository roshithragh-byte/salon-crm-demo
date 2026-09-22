const { defineConfig } = require('prisma/config');
const config = defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});
console.log(JSON.stringify(config, null, 2));
