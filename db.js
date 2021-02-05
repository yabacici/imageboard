const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/images`
);

module.exports.getImages = () => {
    const q = `SELECT * FROM images ORDER BY id DESC LIMIT 6`;
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

//

module.exports.getMoreImages = function (lastId) {
    const q = `SELECT * FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 6`;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.getLastImgId = function (lastId) {
    const q = `SELECT url, title, id, (
      SELECT id FROM images
      ORDER BY id ASC
      LIMIT 3
  ) AS "smallestId" FROM images
  WHERE id < $1
  ORDER BY id DESC
  LIMIT 6`;
    const params = [lastId];
    return db.query(q, params);
};

module.exports.getComments = function (imageId) {
    const q = `SELECT * FROM comments WHERE image_id=$1;`;
    const params = [imageId];
    return db.query(q, params);
};

module.exports.addComment = function (username, comment, imageId) {
    const q = `INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *`;
    const params = [username, comment, imageId];
    return db.query(q, params);
};

module.exports.lastImage = function () {
    return db.query(`SELECT id FROM images ORDER BY id ASC LIMIT 1`);
};
