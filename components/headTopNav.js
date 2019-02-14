//全局组件
Vue.component('headTopNav', {
    props: ['isFull', 'touxiang', 'isBox', 'globalNav', 'gotoPage'],
    template: `
<div>
    <div class="header" :class="{'centerHeader':!globalNav}" :style="{right:isFull?'0px':'280px'}">
        <div :class="{headerCenter:globalNav}">
            <div class="left">
                <!--<a :href="api+'/static/act/index.html'"><img src="./images/logo.png" alt=""></a>
                <a :href="api+'/static/act/index.html'"><span class="kaihei">活动</span></a>
                <a :href="api+'/static/good/list.html'"><span class="libao">游戏商城</span></a>-->
                <a :href="api+'/baba/view/index'"><img src="./images/logo.png" alt=""></a>
                <a :href="api+'/baba/view/index'"><span class="kaihei">活动</span></a>
                <a :href="api+'/static/good/list.html'"><span class="libao">游戏商城</span></a>
                <a href="userJifen.html"><span class="">赚金币换游戏</span></a>
            </div>
            <div class="right">
                <div class="lingqu">
                    <a href="javascript:;" class="radom"></a>
                    <p v-if="hours" @click="jianBaoxiang">
                        {{isPicked?text:'立即领取'}}
                    </p>
                    <p v-if="!hours">{{text}}</p>
                    <!--<p @click="jianBaoxiang">{{text}}</p>-->
                </div>
                <div class="search">
                    <input type="text" v-model="skey" placeholder="搜索" @keyup.13="searchFn">
                    <a href="javascript:;" @click="searchFn">
                        <img src="./images/headerSearch.png" alt="">
                    </a>
                </div>
                <a v-if="globalNav" class="touxiang" @click="loginOrCenter">
                    <img :src="userInfor.avatar||touxiang" alt="">
                </a>
            </div>
    </div>
    </div>
    <!--捡到宝箱  个人中心2222222-->
    <div class="dialog" v-if="shiqu">
        <div class="dialog_content">
            <div class="pc">
                <img src="./images/jb.jpg" style="float: left; width: 240px;height: 420px;object-fit: cover;">
                <div class="right">
                    <p class="title">{{boxName}}</p>
                    <b class="xz_infor">恭喜你成功抢到一个宝箱</b>
                    <div class="has">
                        <b>宝箱可能包含</b>
                        <p class="has_dx" v-for="(item,index) in goods">
                            {{item.goodName}}
                        </p>
                    </div>
                </div>
            </div>
            <a href="javascript:;" @click="enterBaoXiang" class="registerBtn shiqu">拾取</a>
            <a class="closed2" @click="shiqu=!shiqu" href="javascript:;">
                <img src="./images/closed2.png" alt="">
            </a>
        </div>
    </div>
    
    <!--boxid为0-->
    <div class="dialog" v-if="notBx">
        <div class="dialog_content">
            <div class="pc">
                <img src="./images/jb.jpg" style="float: left; width: 240px;height: 420px;object-fit: cover;">
                <div class="right">
                    <p class="title">非洲人民欢迎你回家！</p>
                </div>
            </div>
            <a href="javascript:;" @click="notBx=!notBx" class="registerBtn shiqu">我都想你了</a>
            <a class="closed2" @click="notBx=!notBx" href="javascript:;">
                <img src="./images/closed2.png" alt="">
            </a>
        </div>
    </div>
</div>
    `,
    watch: {
        isBox(a){
            console.log(a)
        }
    },
    data(){
        return {
            api: api,
            userInfor: userInfor, //是否登录
            hours: false,
            skey: getSearchString('skey') || '',
            shiqu: false,
            goods: [],
            text: '',
            timer: null,
            boxName: '',
            boxId: 0,
            notBx: false,
            isPicked: false  //今天有没有领取过宝箱？？？？
        }
    },
    mounted(){
        this.time(20)
        this.timer = setInterval(() => {
            this.time(20)
        }, 1000)
        this.getOne()
    },
    methods: {
        loginOrCenter(){
            if (userInfor) {
                window.location.href = "userJifen.html?navIndex=userJifen"
            } else {
                window.location.href = "login.html"
            }
        },
        // 搜索
        searchFn(){
            this.$root.page = 1
            if (this.globalNav) {
                this.$root.list = []
            }
            if (this.$root.getData) {
                this.$root.getData(this.skey)
            }
            if (this.gotoPage) {
                this.$root.skey = this.skey
                this.$root.toToList()
            }
            this.$emit('search', this.skey)
            bus.emit('skey', this.skey)
        },
        // 捡宝箱
        jianBaoxiang(){
            if (this.boxId === 0) {
                this.notBx = true
            }
            if (!this.isPicked) {
                this.shiqu = true
                this.getData2()
            } else {
                $.Prompt('您今天已经领取过箱子了，不能重复领取')
            }
        },
        // 获取一个可以开启的宝箱
        getOne(){
            var that = this;
            $.ajax({
                url: api + '/baba/box/getOneCanOpenBox',
                type: 'get',
                beforeSend: function () {
                    loading.show()
                },
                success: function (res) {
                    loading.hide()
                    if (res.code == 'LPB0001') {
                        console.log(res)
                        that.boxId = res.data.boxId
                        that.isPicked = res.data.isPicked
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        },
        // 宝箱编辑详情
        getData2(){
            var that = this;
            $.ajax({
                url: api + '/baba/box/getBoxDetailById',
                type: 'get',
                beforeSend: function () {
                    loading.show()
                },
                data: {
                    boxId: that.boxId
                },
                success: function (res) {
                    loading.hide()
                    if (res.code == 'LPB0001') {
                        that.boxName = res.data.boxName
                        that.goods = res.data ? res.data.goods : []
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        },
        // 确认捡宝箱
        enterBaoXiang(){
            if (!this.userInfor) {
                $.Prompt('登录后才可领取宝箱')
                return false
            }
            var that = this;
            $.ajax({
                url: api + '/baba/box/pickUpBox',
                type: 'get',
                beforeSend: function () {
                    loading.show()
                },
                data: {
                    boxId: that.boxId
                },
                success: function (res) {
                    loading.hide()
                    console.log(res)
                    if (res.code == 'LPB0001') {
                        window.location.href = "xiangzi.html"
                    }else if (res.code == 'LPB0003') {
                        $.Prompt(res.message)
                    }else {
                        $.Prompt(res.message)
                        // 已结领取过宝箱
                        that.isPicked = true
                        that.hours = false
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        },
        time(h){
            var dateEnd = new Date();
            var dateNow = new Date();
            var endHours = dateEnd.setHours(h);
            var endM = dateEnd.setMinutes(0);
            var endS = dateEnd.setSeconds(0);

            //求出2个时间对象的时间戳的差值  默认是毫秒数  /1000算出秒数
            var timeX = (dateEnd.getTime() - dateNow.getTime()) / 1000;
            var timeX2 = (dateEnd.getTime() - dateNow.getTime()) / 1000;

            //求出小时的余数  秒数/3600=小时数+余数   此处已经把天数的余数又算进来了 继续进行运算
            var timeH = parseInt(timeX / 3600);
            timeX %= 3600;
            //求分钟
            var timeM = parseInt(timeX / 60);
            timeX %= 60;
            //求秒数
            var timeS = parseInt(timeX);

            //已结到了领取时间
            if (timeX2 < 0) {
                // 已结过了领取时间
                if (timeX2 <= -3600*2) {
                    this.hours = false
                    this.time(h + 24)
                } else {
                    // 领取时间内
                    // 已领取不可再领取
                    if (this.isPicked) {
                        this.hours = false
                        this.time(h + 24)
                    } else {
                        //未领取可以领取
                        this.hours = true
                    }
                }
            } else {
                // 不在领取时间内
                this.text = timeH + ':' + timeM + ':' + timeS
                //console.log('未到领取时间---'+this.text)
                this.hours = false
            }
        }
    }
});

