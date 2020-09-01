
new Vue({
    el: "#app",
    data() {
        return {
            data: ""
        }
    }
    , mounted() {
        if (localStorage.getItem("logs")) {
            this.data = JSON.parse(localStorage.getItem("logs"))
            console.log(this.data)
        } else {

        }
        console.log(this.data)
    },
    methods: {
        clearLog(){
            localStorage.removeItem("logs");
            this.data ="";
        }
    },
})
