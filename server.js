const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
// middleware
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(express.static("public"));
app.use(express.json());
//listen for click on image//
app.get("/images", (req, res) => {
    // console.log("/images route has been hit!!!");
    // res.json - how we send a response to the client!
    // res.json(images);
    db.getImages()
        .then((results) => {
            console.log("result:", results);
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("err in getImages:", err);
        });
});
//listen for click on image//
app.get("/images/:id", (req, res) => {
    db.getSelectedImg(req.params.id)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err, results) => {
            console.log("error: ", err);
            res.json(results.rows);
        });
});
//insert into db//
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("inside/upload!!");
    // console.log("req.body: ", req.body);
    // console.log("req.file: ", req.file);
    // if (req.file) {
    //     res.json({ success: true });
    // } else {
    //     res.json({ success: false });
    // }

    let url = "https://cecile-imageboard.s3.amazonaws.com/" + req.file.filename;
    db.getRecentUpload(
        url,
        req.body.username,
        req.body.title,
        req.body.description
    )
        .then((results) => {
            console.log("results: ", results.rows);
            res.json(results.rows[0]);
        })
        .catch((err) => console.log("err in upload: ", err));
});

app.get("/more/:id", (req, res) => {
    db.getMoreImages(req.params.id).then((results) => {
        console.log("results: ", results.rows);
        db.lastImage().then((data) => {
            res.json({
                lastId: data.rows[0].id,
                images: results.rows,
            });
        });
    });
});

app.get("/more/:smallestId", (req, res) => {
    let smallestId = req.params;
    // console.log( smallestId);
    db.getLastImgId(smallestId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in loading more results", err);
        });
});

//comments listeners////////
// app.get("/comments/:imageId", (req, res) => {
//     db.getComments(req.params.imageId).then((results) => {
//         res.json(results.rows);
//     });
// });
app.get("/comments/:imageId", (req, res) => {
    const imgId = parseInt(req.params.imageId);
    db.getComments(imgId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getComments: ", err);
        });
});

app.post("/comment/:imageId", (req, res) => {
    // convert into interger
    const imgId = parseInt(req.params.imageId);
    // const imgId = parseInt(req.body.imageId);
    console.log("comment here!");
    // console.log(req.body);
    db.addComment(req.body.username, req.body.comment, imgId)
        .then(({ rows }) => {
            const commentData = {
                comment: rows[0].comment,
                username: rows[0].username,
                created_at: rows[0].created_at,
            };
            res.json(commentData);
        })
        .catch((err) => {
            console.log("error in addComment: ", err);
        });

    // push forward the comments from db
});

app.listen(process.env.PORT || 8080, () => console.log("IB Server running"));

// app.listen(8080, () => console.log("IB server is listening..."));

// MY NOTES/////
// const express = require("express");
// const app = express();

// app.use(express.static("public"));

// // this info would be coming from the database!!
// let cities = [
//     {
//         name: "Berlin",
//         country: "DE",
//     },
//     {
//         name: "Guayaquil",
//         country: "Ecuador",
//     },
//     {
//         name: "Venice",
//         country: "Italy",
//     },
// ];

// app.get("/cities", (req, res) => {
//     // the way we get the response to send back to Vue
//     res.json(cities);
// });
// app.listen(8080, () => console.log("Server listening"));
