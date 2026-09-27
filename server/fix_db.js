const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:HBawIKODguZaffbZgPFxJBaXQiKZFHMy@mainline.proxy.rlwy.net:14802/railway'
});

async function run() {
  await client.connect();
  try {
    await client.query(`DROP TABLE IF EXISTS "SalonBusinessHour" CASCADE;`);
    await client.query(`DELETE FROM _prisma_migrations WHERE migration_name = '20260923000000_add_salon_business_hours';`);
    console.log("Cleanup successful");
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}
run();
