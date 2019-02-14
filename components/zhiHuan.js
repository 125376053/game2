//全局组件
Vue.component('zhiHuan', {
    template: `
<div class="dialog" v-if="dialog">
    <div class="dialog_content">
        <img class="left" src="./images/jb.jpg" alt="">
        <div class="right" v-if="step==1">
            <p class="title">充值</p>
            <div class="myPay">
                <img class="touxiang2" :src="userInfor.avatar||touxiang" alt="">
                <div class="infor_xiang2">
                    <div class="lx">
                        <b>特权</b>
                        <p>
                            <img src="./images/zanshi.png" alt="" width="12" height="12">
                            <span>{{userInfor?isTequan:0}}</span>
                        </p>
                    </div>
                    <div class="lx">
                        <b>金币</b>
                        <p>
                            <img src="./images/num1.png" alt="" width="8" height="12">
                            <span>{{userInfor?userjin:0}}</span>
                        </p>
                    </div>
                    <div class="lx">
                        <b>银币</b>
                        <p>
                            <img src="./images/num2.png" alt="" width="8" height="12">
                            <span>{{userInfor?useryin:0}}</span>
                        </p>
                    </div>
                </div>
            </div>
            <div class="content_jinbi">
                <div class="jinbi">
                    <span>￥1:</span>
                    <img src="./images/num1.png" alt="" width="8" height="12">
                    <span class="span2">1</span>
                </div>
                <div class="jinbi_pay">
                    <div class="leftpay">
                        <div class="fangshi2">
                            <a href="javascript:;">
                                <div>
                                    <img src="./images/num1.png" alt="">
                                    <input placeholder="0" type="number" v-model="goldCount">
                                    <span>+</span>
                                    <img src="./images/num2.png" alt="" style="margin-right: 2px;">
                                    <span>{{Math.floor(goldCount/10)}}</span>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div class="rightpay">
                        <b>需支付{{goldCount}}元</b>
                        <p style="color: #aab2bd;">充值每满10个金币赠送一个银币</p>
                    </div>
                </div>
                <img class="who" :src="erweima" alt="">
                <p class="maTishi">消费一经产生不支持退换</p>
            </div>
            <a href="javascript:;" @click="showMa" class="registerBtn shiqu">确认充值</a>
        </div>
        <div v-if="step==2" class="right">
            <p class="title">充值成功</p>
            <div class="content_houtai">
                <p>已为你的账户增加</p>
                <div class="num">
                    <div class="p1">
                        <div>
                            <img src="./images/num1.png" alt="">
                            <span class="span2">{{goldCount}}</span>
                        </div>
                    </div>
                    <div class="p2">
                        <div>
                            <img src="./images/num2.png" alt="">
                            <span class="span2">{{Math.floor(goldCount/10)}}</span>
                        </div>
                    </div>
                </div>
                <img class="who" src="./images/how.jpg" alt="">
            </div>
        </div>
        <a class="closed2" href="javascript:;" @click="dialog=false">
            <img src="./images/closed2.png" alt="">
        </a>
    </div>
</div>
`,
    props: ['touxiang'],
    watch: {
        dialog(a, b){
            if (!a) {
                clearInterval(this.payTimer)
            } else {
                this.step = 1
                this.goldCount=''
                this.erweima=''
                this.getUserPay()
            }
        },
        step(a){
            this.step = a
            if(a!==1){
                clearInterval(this.payTimer)
            }
        }
    },
    data(){
        return {
            userInfor: userInfor, //是否登录
            dialog: false,
            goldCount: '', //置换金币的数量
            oid: 0,
            erweima: '',
            payTimer: '',
            step: 1,
            userjin: '',
            useryin: '',
            isTequan: '',
        }
    },
    mounted(){
        bus.on('showZhiHuan', (data) => {
            this.dialog = data
        })
    },
    methods: {
        //账户余额
        getUserPay(){
            var that = this;
            $.ajax({
                url: api + '/baba/userinfo/getUserAccountAmount',
                type: 'get',
                beforeSend: function () {
                    loading.show()
                },
                success: function (res) {
                    loading.hide()
                    if (res.code == 'LPB0001') {
                        console.log(res)
                        that.userjin = res.data.goldAmount
                        that.useryin = res.data.silverAmount
                        that.isTequan = res.data.boxAmount
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        },
        // 显示二维码
        showMa(){
            if (!this.goldCount) {
                $.Prompt('请输入金币')
                return false
            }/*else if(this.goldCount>this.userjin){
                $.Prompt('充值金币不能大于账户余额')
                return false
            }*/
            var that = this
            this.getAliPayId()
            clearInterval(this.payTimer)
            this.payTimer = setInterval(function () {
                that.checkMa()
            }, 3000)
        },
        // 获取置换金币订单id
        getAliPayId(){
            var that = this;
            $.ajax({
                url: api + '/baba/goods/getReplaceOrderId',
                type: 'get',
                beforeSend: function () {
                    loading.show()
                },
                data: {
                    goldCount: that.goldCount || 0
                },
                success: function (res) {
                    loading.hide()
                    if (res.code == 'LPB0001') {
                        that.oid = res.data
                        var qrsrc = api + '/baba/goods/gotoReplaceGold?oid=' + res.data
                        that.erweima = api + '/baba/act/getQrCode?chl=' + encodeURIComponent(qrsrc) + '&chs=120x120'
                    }
                },
                error: function () {
                    loading.hide()
                }
            })
        },
        // 检测支付状态
        checkMa(){
            var that = this;
            $.ajax({
                url: api + '/baba/goods/getReplaceStatusById',
                type: 'get',
                data: {
                    oid: that.oid
                },
                success: function (res) {
                    if (res.code == 'LPB0001') {
                        if (res.data == 3) {
                            that.step = 2
                            clearInterval(that.payTimer)
                        }
                    }
                },
                error: function () {
                    $.Prompt(res.message)
                }
            })
        }
    }
});
