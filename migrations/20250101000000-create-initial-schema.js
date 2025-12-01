'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create ENUMs first
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Entries_category" AS ENUM ('income', 'expense');
    `);
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Types_category" AS ENUM ('income', 'expense');
    `);

    // 2. Create Currencies table
    await queryInterface.createTable('Currencies', {
      code: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 3. Create Users table (with all fields including email)
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      pin: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      email_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      email_verification_code: {
        type: Sequelize.STRING(10)
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 4. Create Types table (with description field)
    await queryInterface.createTable('Types', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: '"enum_Types_category"',
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 5. Create Entries table (with locked field and DECIMAL amounts)
    await queryInterface.createTable('Entries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      category: {
        type: '"enum_Entries_category"',
        allowNull: false
      },
      note: {
        type: Sequelize.STRING
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      typeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Types', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 6. Create Balances table (with initial_amount and unique constraint)
    await queryInterface.createTable('Balances', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      initial_amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: true
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addConstraint('Balances', {
      fields: ['userId', 'currency', 'month'],
      type: 'unique',
      name: 'unique_user_currency_month_balance'
    });

    // 7. Create Savings table (with locked field and DECIMAL amounts)
    await queryInterface.createTable('Savings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      note: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 8. Create Transfers table (with locked field and DECIMAL amounts)
    await queryInterface.createTable('Transfers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      from_account: {
        type: Sequelize.STRING,
        allowNull: false
      },
      to_account: {
        type: Sequelize.STRING,
        allowNull: false
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      note: {
        type: Sequelize.STRING
      },
      locked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    // 9. Create ClosedMonths table
    await queryInterface.createTable('ClosedMonths', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      closedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    await queryInterface.addConstraint('ClosedMonths', {
      fields: ['userId', 'currency', 'month'],
      type: 'unique',
      name: 'unique_user_currency_month'
    });

    // 10. Create UserCurrencies table
    await queryInterface.createTable('UserCurrencies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'Users', key: 'id' },
        onDelete: 'CASCADE'
      },
      currencyCode: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: { model: 'Currencies', key: 'code' },
        onDelete: 'CASCADE'
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addConstraint('UserCurrencies', {
      fields: ['userId', 'currencyCode'],
      type: 'unique',
      name: 'unique_user_currency'
    });

    // 11. Create MonthCloseAudits table
    await queryInterface.createTable('MonthCloseAudits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      month: {
        type: Sequelize.STRING,
        allowNull: false
      },
      calculated_money_on_hand: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      entered_money_on_hand: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      calculated_savings: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      entered_savings: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      difference_money_on_hand: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      difference_savings: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false
      },
      closed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      note: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Drop tables in reverse order (respecting foreign keys)
    await queryInterface.dropTable('MonthCloseAudits');
    await queryInterface.dropTable('UserCurrencies');
    await queryInterface.dropTable('ClosedMonths');
    await queryInterface.dropTable('Transfers');
    await queryInterface.dropTable('Savings');
    await queryInterface.dropTable('Balances');
    await queryInterface.dropTable('Entries');
    await queryInterface.dropTable('Types');
    await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Currencies');
    
    // Drop ENUMs
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Entries_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Types_category";');
  }
};
