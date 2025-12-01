const { Type } = require('../models');

exports.createType = async (req, res, next) => {
  try {
    const { name, category } = req.body;
    const userId = req.user.id;
    const type = await Type.create({ name, category, userId });
    res.status(201).json(type);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
    //next(err);

};

exports.getAllTypes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 30;
    const offset = parseInt(req.query.offset) || 0;
    const types = await Type.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    res.json(types);
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
    //next(err);

};

exports.deleteType = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    const deleted = await Type.destroy({ where: { id, userId } });
    if (!deleted) return res.status(404).json({ error: 'Type not found.' });
    res.status(204).end();
  } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
   // next(err);

};