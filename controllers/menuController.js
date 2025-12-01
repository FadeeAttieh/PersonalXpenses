const { pool1, pool2 } = require('../db');

// Fetch menu items by parentId
async function getMenu(req, res) {
    const parentId = req.query.parentId || null;
    try {
        const query = `
            SELECT m.id, m.name, m.parent_id, m.icon, COUNT(c.id) AS child_count
            FROM tbl_menu m
            LEFT JOIN tbl_menu c ON m.id = c.parent_id
            WHERE m.parent_id ${parentId === null ? 'IS NULL' : '= $1'}
            GROUP BY m.id
            ORDER BY m.id;
        `;
        const params = parentId === null ? [] : [parentId];
        const result = await pool2.query(query, params);
        res.json(result.rows);
    } catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
}
        //console.error('Failed to fetch menu data:', err);
        res.status(500).json({ error: 'Failed to fetch menu data' });
    }


module.exports = { getMenu };