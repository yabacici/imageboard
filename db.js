const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

module.exports.getImages = () => {
    // const q = `SELECT * FROM images ORDER BY id DESC LIMIT 6`;
    const q = `SELECT * FROM images
        ORDER BY created_at DESC LIMIT 6`;
    return db.query(q);
};

module.exports.getRecentUpload = (url, username, title, description) => {
    const q = `INSERT INTO images (url, username, title, description) VALUES ($1,$2,$3, $4) RETURNING url, username, title, description`;
    const params = [url, username, title, description];
    return db.query(q, params);
};

module.exports.getSelectedImg = function (id) {
    const q = `SELECT * FROM images WHERE id = $1`;
    const params = [id];
    return db.query(q, params);
};
