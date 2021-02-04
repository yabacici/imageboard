// console.log("script is linked");
// this file is where all of our Vue code will exist!!
// here vue comp takes 2 arg(string , obj(which temp to use))
Vue.component("second-component", {
    template: "#comment",
    data: function () {
        return {
            comments: [],
            username: "",
            comment: "",
        };
    },
    props: ["imageId"],

    mounted: function () {
        var self = this;
        axios.get(`/comments/${this.imageId}`).then(function (res) {
            console.log(res.data);
            self.username = res.data[0].username;
            self.comment = res.data[0].comment;
            self.comments = res.data;
        });
    },
    methods: {
        commentHandler: function () {
            var self = this;
            var obj = {
                comment: this.comment,
                username: this.username,
                imageId: this.imageId,
            };
            axios
                .post(`/comment/${this.imageId}`, obj)
                // comment: self.comment,
                // username: self.username,
                // imageId: self.imageId,

                .then(function (res) {
                    // obj.id = res.data.id;
                    // obj.comment = res.data.comment;
                    // obj.username = res.data.username;
                    // self.comments.push(obj);
                    self.comments.push(res.data[0]);
                })
                .catch((err) => console.log("err", err));
        },
    },
});

Vue.component("first-component", {
    template: "#modal",
    // data with func so each component has its own return
    data: function () {
        return {
            // name: "Cecile",
            // count: 0,
            url: "",
            username: "",
            title: "",
            description: "",
            date: "",
            id: "",
        };
    },
    props: ["imageId"],

    mounted: function () {
        // console.log("component mounted", this.imageId);
        var self = this;
        axios.get(`/images/${this.imageId}`).then(function (response) {
            // console.log(response.data[0]);
            self.url = response.data[0].url;
            self.username = response.data[0].username;
            self.title = response.data[0].title;
            self.description = response.data[0].description;
            self.date = response.data[0].created_at;
        });
    },
    watch: {
        selectedImg: function () {
            console.log("modal should show new img");
        },
    },
    methods: {
        // increaseCount: function () {
        //     this.count++;
        // },
        closeModal: function () {
            // console.log("please close modal");
            this.$emit("close");
        },
    },
});

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
            // selectedImg: 1,
            // when the page loads it's not there so null
            // when user clicks goes to 1 and pops up new page
            selectedImg: null,
            // selectedImg: location.hash.slice(1),
            smallestId: "",
            getMore: true,
            // lastImg: 0,
            imageId: "",
            // imageId: location.hash.slice(1) || 0,
            id: "",
        },

        // location to talk to the server
        // mounted is a lifecycle method that runs when the Vue instance renders
        mounted: function () {
            // console.log("my vue instance has mounted");
            console.log("this outside axios", this);
            addEventListener("hashchange", () => {
                console.log("hash got updated:", location.hash);
                // want to reset the val of selectedImg
                this.selectedImg = location.hash.slice(1);
            });
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
                    self.smallestId = self.images[self.images.length - 1].id;
                    console.log("smallestId:", self.smallestId);
                })
                .catch(function (err) {
                    console.log("err in /images: ", err);
                });
        }, // request ending

        // methods will store ALL the functions we create!!!
        // this is where we store func for event listeners
        methods: {
            // closeMe: function () {
            //     console.log("clooooose me");
            // },
            closeModal: function () {
                console.log("clooooose me");
                this.selectedImg = null;
            },
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
            // moreImages: function () {
            //     var smallestId = this.images[this.images.length - 1].id;
            //     var self = this;
            //     axios.get(`/more/${smallestId}`).then(function ({ data }) {
            //         // console.log("LastImg: ", self.smallestId);
            //         console.log("smallestId: ", data[0].smallestId);

            //         self.smallestId = self.images[self.images.length - 1].id;
            //         for (let i = 0; i < data.length; i++) {
            //             if (data[i].id === data[i].smallestId) {
            //                 self.getMore = false;
            //             }
            //         }
            //         self.images = [...self.images, ...data];
            //     });
            // },
            moreImages: function () {
                var smallestId = this.images[this.images.length - 1].id;
                console.log("this is smallestid:", smallestId);
                var self = this;
                axios
                    .get(`/more/${smallestId}`)
                    .then(function (response) {
                        console.log("log selfgetmore:", self.getMore);
                        for (var i = 0; i < response.data.length; i++) {
                            // self.images.push(response.data[i]);

                            if (
                                response.data[i].id ===
                                response.data[i].smallestId
                            ) {
                                self.getMore = false;
                                console.log(
                                    "log selfgetmore after:",
                                    self.getMore
                                );
                            }
                        }
                    })
                    .catch(function (err) {
                        console.log("err in axios load more: ", err);
                    });
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
