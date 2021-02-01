// console.log("script is linked");
// this file is where all of our Vue code will exist!!

(function () {
    new Vue({
        // el - element in our html that has access to our Vue code!
        el: "#main",
        // data - an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },

        // location to talk to the server
        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            // console.log("my vue instance has mounted");
            console.log("this outside axios", this);
            // AXIOS grabs info and stores it
            // talk to server via axios
            // for the server to listen we need a route on the server
            // once it recieves the response we can run .THEN
            // better to store THIS in a var so it does not lose its meaning once in axios
            var self = this;

            axios
                .get("/images")
                .then(function (response) {
                    // console.log("this inside axios: ", self);
                    // axios will ALWAYS store the info coming from the server inside a 'data' property
                    // console.log("response from /cities: ", response.data);
                    self.images = response.data;
                })
                .catch(function (err) {
                    console.log("err in /images: ", err);
                });
        }, // request ending

        // methods will store ALL the functions we create!!!
        // this is where we store func for event listeners
        methods: {
            clickHandler: function () {
                const fd = new FormData();
                fd.append("title", this.title);
                fd.append("description", this.description);
                fd.append("username", this.username);
                fd.append("file", this.file);
                axios
                    .post("/upload", fd)
                    // .then((response) => console.log("response: ", response))
                    .then((response) => this.images.push(response.data))
                    .catch((err) => console.log("err: ", err));
            },
            fileSelectHandler: function (e) {
                this.file = e.target.files[0];
            },
        }, // meth ending
    });
})();

////MY NOTES////

// (function () {
//     new Vue({
//         el: "#main",
//         data: {
//             name: "Adobo",
//             seen: true,
//             cities: [],
//         },
//         // life cycle method
//         // location to talk to the server
//         mounted: function () {
//             // console.log("y ue is instance is mounted");
//             console.log("this outside axios", this);
//             // AXIOS grab info and stores it
//             // talk to server via axios
//             // for the server to listen we need a route on the server
//             // once it recieves the response we can run .THEN
//             // better to store THIS in a var so it does not lose its meaning once in axios
//             var self = this;
//             // use function instead of arrow func bcuz of older browser
//             axios.get("/cities").then(function (response) {
//                 console.log("this inside axios", self);
//                 // THIS reference the window global obj
//                 console.log("response from /citieses", response.data);
//                 // whatever data I can back make it cities
//                 self.cities = response.data;
//             });
//         },
//         methods: {
//             myFunction: function () {
//                 console.log("myFunc is running!!!");
//             },
//         },
//     });
// })();
