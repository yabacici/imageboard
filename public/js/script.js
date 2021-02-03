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
            self.comments = res.data;
        });
    },
    methods: {
        commentHandler: function () {
            axios
                .post("/comment", {
                    comment: this.comment,
                    username: this.username,
                })
                .then((res) => {
                    console.log("upload res:", res.data.comment);
                    this.comments.unshift(res.data);
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

            // comments: [],
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
            // smallestId: "",
            getMore: true,
            lastImg: 0,
            seen: false,
            imageId: "",
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
                    self.lastImg = self.images[self.images.length - 1].id;
                    console.log("latestId:", self.lastImg);
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
            moreImages: function () {
                var self = this;
                axios.get(`/more/${self.lastImg}`).then(function ({ data }) {
                    console.log("LastImg: ", self.lastImg);
                    console.log("LowestId: ", data[0].lowestId);

                    self.lastImg = self.images[self.images.length - 1].id;
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === data[i].lowestId) {
                            self.more = false;
                        }
                    }
                    self.images = [...self.images, ...data];
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
