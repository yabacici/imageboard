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
