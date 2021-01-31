const express = require("express");
const app = express();
const db = require("./db");

app.use(express.static("public"));

// this info would be coming from the database!!
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

// app.listen(8080, () => console.log("IB server is listening..."));
app.listen(process.env.PORT || 8080, () => console.log("IB Server running"));
// MY NOTES/////
// const express = require("express");
// const app = express();

// app.use(express.static("public"));

// let cities = [
//     {
//         name: "Berlin",
//         country: "DE",
//     },
//     {
//         name: "Paris",
//         country: "FR",
//     },
//     {
//         name: "London",
//         country: "UK",
//     },
// ];

// app.get("/cities", (req, res) => {
//     // the way we get the response to send back to Vue
//     res.json(cities);
// });
// app.listen(8080, () => console.log("Server listening"));
