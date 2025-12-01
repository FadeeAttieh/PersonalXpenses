const Joi = require('joi');

exports.register = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  pin: Joi.string().min(4).max(12).required(),
  email: Joi.string().email().required()
});

exports.login = Joi.object({
  username: Joi.string().required(),
  pin: Joi.string().required(),
  turnstileToken: Joi.string().optional(),
  'cf-turnstile-response': Joi.string().optional()
});

exports.entry = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().required(),
  date: Joi.date().required(),
  note: Joi.string().allow(''),
  typeId: Joi.number().integer().required(),
  category: Joi.string().valid('income', 'expense').required()
});

exports.type = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  category: Joi.string().valid('income', 'expense').required()
});

exports.savings = Joi.object({
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  date: Joi.date().required(),
  note: Joi.string().allow('')
});

exports.transfer = Joi.object({
  from_account: Joi.string().required(),
  to_account: Joi.string().required(),
  amount: Joi.number().positive().required(),
  currency: Joi.string().required(),
  date: Joi.date().required(),
  note: Joi.string().allow('')
});

exports.balance = Joi.object({
  currency: Joi.string().required(),
  amount: Joi.number().required(),
  month: Joi.string().regex(/^\d{4}-\d{2}$/).optional()
});

exports.closeMonth = Joi.object({
  month: Joi.string().required(),
  balances: Joi.array().items(
    Joi.object({
      currency: Joi.string().required(),
      moneyOnHand: Joi.number().required(),
      savings: Joi.number().required()
    })
  ).required()
});
module.exports = {
  register: exports.register,
  login: exports.login,
  entry: exports.entry,
  type: exports.type,
  savings: exports.savings,
  transfer: exports.transfer,
  balance: exports.balance,
  closeMonth: exports.closeMonth
};