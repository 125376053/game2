//全局组件
Vue.component('centerRightNav', {
    props:['isFull','touxiang','isAuth'],
    template: `
<div class="right_user" :style="{width:isFull?'0':'280px'}">
    <img class="tx" :src="userInfor.avatar||touxiang" alt="">
    <div class="user_infor">
        <h3>{{userInfor.nickName}}</h3>
        <div class="div1" v-if="!isAuth">
            <p class="p1">
                <img src="./images/zanshi3.png" alt="">
                <span>{{user.privilege}}</span>
            </p>
            <p class="p1">
                <img src="./images/add1.png" alt="" class="jybi">
                <span>{{user.goldCount}}</span>
            </p>
            <p class="p1">
                <img src="./images/add2.png" alt="" class="jybi">
                <span>{{user.silverCount}}</span>
            </p>
            <p @click="showZhiHuan" class="houtai"></p>
        </div>

        <div class="div1" v-if="isAuth">
            <p class="p1">
                <img src="./images/zanshi3.png" alt="">
                <span>{{admin.privilege}}</span>
            </p>
            <p class="p1">
                <img src="./images/add1.png" alt="" class="jybi">
                <span>{{admin.goldCount}}</span>
            </p>
            <p class="p1">
                <img src="./images/add2.png" alt="" class="jybi">
                <span>{{admin.silverCount}}</span>
            </p>
            <p @click="showZhiHuan" class="houtai"></p>
        </div>
    </div>

    <ul class="user_nav_list" v-if="!isAuth">
        <li>
            <a href="libao.html?navIndex=libao" :class="{centerCur:navIndex==='libao'}">
                <span>礼包</span>
                <b>{{user.orderCount}}</b>
            </a>
        </li>
        <li>
            <a href="xiangzi.html?navIndex=xiangzi" :class="{centerCur:navIndex==='xiangzi'}">
                <span>宝箱</span>
                <b>{{user.boxCount}}</b>
            </a>
        </li>
        <li>
            <a href="ziliao.html?navIndex=ziliao" :class="{centerCur:navIndex==='ziliao'}">
                <span>个人资料</span>
                <b>{{user.userInfoCount}}</b>
            </a>
        </li>
        <li>
            <a href="shouyi.html?navIndex=shouyi" :class="{centerCur:navIndex==='shouyi'}">
                <span>积分记录</span>
                <b>{{user.balaceCount}}</b>
            </a>
        </li>
        <li>
            <a href="userJifen.html?navIndex=userJifen" :class="{centerCur:navIndex==='userJifen'}">
                <span>积分规则</span>
                <b>{{user.ruleCount}}</b>
            </a>
        </li>
    </ul>

    <ul class="user_nav_list" v-if="isAuth">
        <li>
            <a href="order.html?navIndex=order" :class="{centerCur:navIndex==='order'}">
                <span>订单查询</span>
                <b>{{admin.orderCount}}</b>
            </a>
        </li>
        <li>
            <a href="setbx.html?navIndex=setbx" :class="{centerCur:navIndex==='setbx'}">
                <span>宝箱设置</span>
                <b>{{admin.boxCount}}</b>
            </a>
        </li>
        <li>
            <a href="jifenCount.html?navIndex=jifenCount" :class="{centerCur:navIndex==='jifenCount'}">
                <span>积分统计</span>
                <b>{{admin.creditCount}}</b>
            </a>
        </li>
        <li>
            <a href="admin.html?navIndex=admin" :class="{centerCur:navIndex==='admin'}">
                <span>用户管理</span>
                <b>{{admin.userCount}}</b>
            </a>
        </li>
        <li>
            <a href="jifenEditor.html?navIndex=jifenEditor" :class="{centerCur:navIndex==='jifenEditor'}">
                <span>积分规则</span>
                <b>{{admin.ruleCount}}</b>
            </a>
        </li>
        <li>
            <a href="request.html?navIndex=request" :class="{centerCur:navIndex==='request'}">
                <span>收录请求</span>
                <b>{{admin.saveSteamCount}}</b>
            </a>
        </li>
        <li>
            <a href="game.html?navIndex=game" :class="{centerCur:navIndex==='game'}">
                <span>游戏管理</span>
                <b>{{admin.gameCount}}</b>
            </a>
        </li>
    </ul>

    <div class="logout">
        <p v-if="isAuthShow" class="p1" @click="changeAuth">
            {{!isAuth?'切换成管理员':'切换成普通用户'}}
        </p>
        <p class="p2" @click="logout">退出登录</p>
    </div>
</div>
`,
    watch:{
        userInfor(a){
            console.log(a)
        }
    },
    data(){
        return {
            api:api,
            userInfor:userInfor, //是否登录
            isAuthShow:false, //是否是管理员 后台给
            user:{},
            admin:'',
            navIndex:getSearchString('navIndex')||''
        }
    },
    mounted(){
        this.getUser()
        this.getAuth()
    },
    methods:{
        showZhiHuan(){
            bus.emit('showZhiHuan', true)
        },
        // 切换全屏和半屏
        changeAuth(){
            this.$root.isAuth=!this.$root.isAuth
            console.log(this.$root.isAuth);
            if(this.$root.isAuth){
                // 管理员默认页面
                window.location.href="admin.html?navIndex=admin"
            }else{
                // 普通用户默认页面
                window.location.href="userJifen.html?navIndex=userJifen"
            }
        },
        // 后台基本信息
        getAuth(){
            var that=this;
            $.ajax({
                url:api+'/baba/userinfo/getManageBackground',
                type:'get',
                beforeSend:function(){
                    loading.show()
                },
                success:function(res){
                    loading.hide()
                    that.admin=res.data
                },
                error:function(){
                    loading.hide()
                }
            })
        },
        // 普通用户
        getUser(){
            var that=this;
            $.ajax({
                url:api+'/baba/userinfo/getUserBackground',
                type:'get',
                beforeSend:function(){
                    loading.show()
                },
                success:function(res){
                    loading.hide()
                    that.user=res.data
                    that.isAuthShow=res.data.isAdmin
                },
                error:function(){
                    loading.hide()
                }
            })
        },
        // 退出登录
        logout(){
            var that=this;
            $.ajax({
                url:api+'/baba/act/logout',
                type:'get',
                beforeSend:function(){
                    loading.show()
                },
                success:function(res){
                    console.log(res)
                    loading.hide()
                    window.sessionStorage.removeItem('userInfor')
                    //window.location.href=that.api+"/static/act/index.html"
                    window.location.href=that.api+"/baba/view/index"
                },
                error:function(){
                    loading.hide()
                }
            })
        },
    }
});

