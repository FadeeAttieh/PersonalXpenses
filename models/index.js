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

// Check if DATABASE_URL is provided (Railway, Heroku, etc.)
if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
  console.log('Using DATABASE_URL connection');
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
