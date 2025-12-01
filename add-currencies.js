const { Currency } = require('./models');

async function addCurrencies() {
  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'LBP', name: 'Lebanese Pound' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'TRY', name: 'Turkish Lira' }
  ];

  console.log('Adding currencies to database...');
  
  for (const curr of currencies) {
    try {
      await Currency.findOrCreate({
        where: { code: curr.code },
        defaults: curr
      });
      console.log(`✓ ${curr.code} - ${curr.name}`);
    } catch (error) {
      console.error(`✗ Failed to add ${curr.code}:`, error.message);
    }
  }

  console.log('\nCurrent currencies in database:');
  const all = await Currency.findAll({ order: [['code', 'ASC']] });
  all.forEach(c => console.log(`  ${c.code} - ${c.name}`));
  
  process.exit(0);
}

addCurrencies();
