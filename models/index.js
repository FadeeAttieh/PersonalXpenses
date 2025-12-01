'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;

// Log environment for debugging
console.log('Environment:', env);
console.log('DATABASE_URL exists?', !!process.env.DATABASE_URL);
console.log('DATABASE_PRIVATE_URL exists?', !!process.env.DATABASE_PRIVATE_URL);
console.log('PGHOST exists?', !!process.env.PGHOST);

// Priority 1: Use Railway's private network URL (FREE, no egress fees)
if (process.env.DATABASE_PRIVATE_URL) {
  console.log('Using DATABASE_PRIVATE_URL (Railway private network - no egress fees)');
  sequelize = new Sequelize(process.env.DATABASE_PRIVATE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      // Private network doesn't need SSL
      ssl: false
    }
  });
}
// Priority 2: Check for Railway's individual PG variables with private domain
else if (process.env.PGHOST && process.env.PGUSER && process.env.PGPASSWORD && process.env.PGDATABASE) {
  console.log('Using Railway PG variables');
  const usePrivate = process.env.PGHOST.includes('railway.internal');
  console.log('Using private network?', usePrivate);
  
  sequelize = new Sequelize(
    process.env.PGDATABASE,
    process.env.PGUSER,
    process.env.PGPASSWORD,
    {
      host: process.env.PGHOST,
      port: process.env.PGPORT || 5432,
      dialect: 'postgres',
      logging: console.log,
      dialectOptions: usePrivate ? {} : {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    }
  );
}
// Priority 3: Check if DATABASE_URL is provided (Railway public, Heroku, etc.)
else if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
  console.log('Using DATABASE_URL connection (public - may incur egress fees)');
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  });
} else if (config.use_env_variable && process.env[config.use_env_variable]) {
  console.log('Using config.use_env_variable:', config.use_env_variable);
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Use individual connection parameters (Docker, local development)
  console.log('Using individual connection parameters');
  const dbName = process.env.DATABASE_NAME || process.env.DB1_NAME || config.database;
  const dbUser = process.env.DATABASE_USER || process.env.DB1_USER || config.username;
  const dbPass = process.env.DATABASE_PASSWORD || process.env.DB1_PASSWORD || config.password;
  const dbHost = process.env.DATABASE_HOST || process.env.DB1_HOST || config.host;
  const dbPort = process.env.DATABASE_PORT || process.env.DB1_PORT || 5432;

  console.log('DB Config:', { dbHost, dbPort, dbName, dbUser });

  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: console.log,
  });
}

// Import all models
db.User = require('./User')(sequelize);
db.Currency = require('./Currency')(sequelize);
db.Type = require('./Type')(sequelize);
db.Entry = require('./Entry')(sequelize);
db.Savings = require('./Savings')(sequelize);
db.Transfer = require('./Transfer')(sequelize);
db.Balance = require('./Balance')(sequelize);
db.ClosedMonth = require('./ClosedMonth')(sequelize);
db.UserCurrency = require('./UserCurrency')(sequelize);
db.MonthCloseAudit = require('./MonthCloseAudit')(sequelize, Sequelize.DataTypes);

// Add associations if needed
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
