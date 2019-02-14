var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?2387659c100ddb83242eb16a65a22724";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
})();

var userInfor = JSON.parse(window.sessionStorage.getItem('userInfor')) || '';
var path = window.location.pathname;
var api= 'https://www.babagame.vip' //正式
//var api = 'http://47.105.40.60:8082' // 测试
//var api = 'http://47.105.40.60:8092' // 本地调试 已登录
// 15201169571   123456
isLogin()
function isLogin(){
    var loginURL=api+'/baba/userinfo/userislogin'
    var xhr = new XMLHttpRequest();
    xhr.open('GET', loginURL, true);
    xhr.withCredentials = true;
    xhr.send(null);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4){
            if(xhr.status>=200 && xhr.status<300 || xhr.status==304){
                var res=eval('('+xhr.responseText+')')
                if(!res.data.isLogin){
                    allowLogin()
                    window.sessionStorage.removeItem('userInfor')
                }else{
                    loginNoPage()
                    //缓存本地信息
                    var userInfor=JSON.stringify(res.data.userInfo);
                    window.sessionStorage.setItem('userInfor',userInfor)
                    userInfor = JSON.parse(window.sessionStorage.getItem('userInfor')) || '';
                    console.log(userInfor)
                }
            }else{
                console.log((xhr.status));
            }
        }
    }
}

// 不允许登录
function allowLogin(){
    if(path.search('index.html')>0){
        console.log('1')
    }else if(path.search('list.html')>0){
        console.log('1')
    }else if(path.search('login.html')>0){
        console.log('1')
    }else if(path.search('register.html')>0){
        console.log('1')
    }else{
        window.location.href="login.html"
    }
}
// 登录后
function loginNoPage(){
    if(path.search('login.html')>0){
        window.location.href="index.html"
    }
}


