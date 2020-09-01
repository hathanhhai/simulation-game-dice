
new Vue({
    el: "#app",
    data() {
        return {
            number_player: "",
            begin: false,

            target: 7,
            dice: {
                min: -6,
                max: 6
            },


            match: {
                match_name: "",
                match_date: ""
            },


            text_simulation: "",



            players: [

            ],
            required: {
                required_number_value: false
            },
            round: 1,
            flag_loop: true,
            flag: false,
            text_log: {
                match: "",
                round: "",
                date: "",
                player_winner: "",
                logs: [],
            }


        }
    },
    mounted() {

        //console.log( this.getRandomArbitrary(this.dice.min,this.dice.max))
        //this.roundRun();
    },
    methods: {



        async requestRandom() {

            var request_random = await axios.get("https://stg-elearning.isbservice.com/api/test?min=" + this.dice.min + "&max=" + this.dice.max);
            // var value_return = request_random.data.result.random.data;

            return request_random.data.data;

        },
        
        submitNumberPlayer() {
            if (this.number_player && this.number_player > 0 && this.number_player <= 10) {
                this.begin = true
            } else {
                this.required.required_number_value = true
                this.begin = false
            }

            this.createPlayer();
            this.roundRun();
        },
        //create match and player
        createPlayer() {
            this.match.match_name = "MATCH" + Math.floor(Math.random() * Math.floor(1000));
            var date = new Date();
            this.match.match_date = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
            this.text_log.match = this.match.match_name;
            this.text_log.date = this.match.match_date;
            this.pushTextSimulation("<p>----------- " + this.match.match_name + " ----------</p>");
            this.pushTextSimulation("<p>----------- " + this.match.match_date + " ----------</p>");
            this.pushTextSimulation("<p>----------- Goal " + this.target + " ----------</p>");
            for (var i = 1; i <= this.number_player; i++) {
                var element = {
                    player_name: this.randomString(1) + Math.floor(Math.random() * Math.floor(1000)),
                    player_current_position: 0,
                }
                this.players.push(element);
                this.pushTextSimulation("<p> Created Player: <span class='player_name'>" + element.player_name + "</span>  </p> ");

            }
            this.pushTextSimulation("<p>-----------START GAME----------</p>");
        },
        //create handle call API and run game
        async roundRun() {


            this.pushTextSimulation("<p>----- Round: " + this.round + "-------------" + "</p>")
            var _this = this;
            var i = 0;
            var flag = false;
            await Promise.all(this.players.map(async item => {
                var dice = [];
                var temp = [];
                dice = await _this.requestRandom();
                temp.push(dice)
                // waiting for request api
                Promise.all(temp).then(result => {
                    var dice_random = result[0]
                    var element_log = {
                        come: false,
                        current: item.player_current_position,
                        become: "",
                        comeValue: "",
                        player: item.player_name
                    }
                    if (_this.flag_loop == true) {

                        if (dice_random < 0) {
                            element_log.come = true
                        }
                        element_log.comeValue = dice_random
                        item.player_current_position = _this.getComeGoal(this.target, dice_random, item.player_current_position)
                        element_log.become = item.player_current_position;
                        if (dice_random < 0) {

                            _this.pushTextSimulation("<p>Player: <span class='player_name'>" + item.player_name + "</span>  back <span class='back'>" + Math.abs(dice_random) + "</span>  step" + " current step is: <span class='current'>" + item.player_current_position + "</span></p>");
                        } else if (dice_random > 0) {
                            _this.pushTextSimulation("<p>Player: <span class='player_name'>" + item.player_name + "</span>  come   <span class='come'>" + Math.abs(dice_random) + "</span> " + " step" + " current step is: <span class='current'>" + item.player_current_position + "</span></p>");

                        } else if (dice_random == 0) {
                            _this.pushTextSimulation("<p>Player:  <span class='player_name'>" + item.player_name + "</span>  Still  here at step <span class='current'>" + item.player_current_position + "</span></p>");
                        }

                        if (item.player_current_position == this.target) {
                            _this.text_log.logs.push(element_log)
                            _this.flag = false;
                            _this.pushTextSimulation("<p>************✨✨  <b style='color:#f70000'>PLAYER: " + item.player_name + " winner " + "</b>✨✨*****************" + "</p>")
                            _this.flag_loop = false;
                            _this.text_log.player_winner = item.player_name
                            //handle save log
                            if (localStorage.getItem("logs")) {
                                var logs = localStorage.getItem("logs");
                                logs = JSON.parse(logs);
                                logs.push(_this.text_log)
                                localStorage.setItem("logs", JSON.stringify(logs));
                            } else {
                                var logs = [];
                                logs.push(_this.text_log)
                                localStorage.setItem("logs", JSON.stringify(logs));
                            }

                        } else {
                            _this.text_log.logs.push(element_log)
                            _this.flag = true;

                        }


                    }

                })
            }))

            await this.checkContinue(this.flag);

        },
        //check call back
        checkContinue(flag) {
            if (flag) {
                this.round = parseInt(this.round) + 1
                this.text_log.round = this.round;
                this.roundRun();
            }
        },
        //push test
        pushTextSimulation(text) {
            this.text_simulation += text;
        },
        //get string for player name
        randomString(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
      
        //get maxvalue when overflow
        getComeGoal(max_value, value, current_value) {

            var temp = parseInt(current_value) + parseInt(value);
            if (temp < 0) {
                return 0;
            }
            if (temp >= max_value) {
                return max_value;
            } else {
                return temp;
            }
        }


    }


})