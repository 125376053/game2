
/*var token = sessionStorage.getItem("userInfor");
$.ajaxSetup({
    dataType: "json",
    cache: false,
    headers: {
        "token": token
    },
    xhrFields: {
        withCredentials: true
    },
    complete: function(xhr) {
        alert(123)
        //token过期，则跳转到登录页面
        if(xhr.responseJSON.code == 401){
            window.location.href = 'login.html'
        }
    }
})*/

// 秒转换为时分秒
function formatSeconds(times){
    //求出小时的余数  秒数/3600=小时数+余数   此处已经把天数的余数又算进来了 继续进行运算
    var timeH = parseInt(times / 3600);
    times %= 3600;
    //求分钟
    var timeM = parseInt(times / 60);
    times %= 60;
    //求秒数
    var timeS = parseInt(times);

    return timeH+','+timeM+','+timeS
}
//取地址栏参数
function getSearchString(key) {
    // 获取URL中?之后的字符
    var str = location.search;
    str = str.substring(1, str.length);

    // 以&分隔字符串，获得类似name=xiaoli这样的元素数组
    var arr = str.split("&");
    var obj = new Object();

    // 将每一个数组元素以=分隔并赋给obj对象
    for (var i = 0; i < arr.length; i++) {
        var tmp_arr = arr[i].split("=");
        obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
    }
    return obj[key];
}

//cookie
function setCookie(name, value, day) {
    var date = new Date();//获取时间对象
    date.setDate(date.getDate() + day);//设置过期时间
    //设置cookie
    document.cookie = name + "=" + value + ";expires=" + date;
}
function getCookie(name) {
    var arr = document.cookie.split('; ');
    for (var i = 0; i < arr.length; i++) {
        var arr2 = arr[i].split('=');
        if (arr2[0] == name) {
            return arr2[1];
        }
    }
    return '';
}
function removeCookie(name) {
    setCookie(name, '1', -1);
}

//弹出层组件
(function ($) {
    $.extend({
        lockScreen: function (json) {
            var that = this;
            var dialog, lockScreen, loadCotent, closed;
            //$('#'+json.begin).show();
            var cloneId = $('#' + json.begin).clone(true); //append会追加删除 如何使元素追加后不删除 追加时追加元素副本
            //clone(true) true在克隆的时候保留之前元素的事件
            cloneId.show();
            //防止多次创建
            if (document.getElementById('dialog')) {
                return false;
            }
            //创建元素和样式
            create()
            function create() {
                //动态创建元素骨架
                dialog = $("<div id='dialog'></div>");
                lockScreen = $("<div id='lockScreen'></div>");
                $("body").append(dialog, lockScreen);
                dialog.append(cloneId);

                //默认样式
                dialog.css({
                    width: $('#' + json.begin).outerWidth(true),
                    height: $('#' + json.begin).outerHeight(true),
                    background: $('#' + json.begin).css('background'),
                    position: "fixed",
                    zIndex: "9999",
                    left: json.left || '50%',
                    top: json.top || '50%',
                    bottom: json.bottom || '50%',
                    marginLeft: function () {
                        return -$('#' + json.begin).outerWidth(true) / 2
                    },
                    marginTop: json.mtop || -$('#' + json.begin).outerHeight(true) / 2,
                    'border-radius': '10px'
                });
                lockScreen.css({
                    width: "100%",
                    height: '5000px',
                    background: "#000",
                    position: "absolute",
                    zIndex: 9998,
                    left: 0,
                    top: 0,
                    opacity: json.opacity
                })
            }

            //调用弹出层
            xpqLogin();
            function xpqLogin() {
                lockScreen.height($(window).height() + $(window).scrollTop());
            }

            $(window).resize(function () {
                xpqLogin();
            })
            $(window).scroll(function () {
                xpqLogin();
            })
            $("." + json.closed).click(function (event) {
                event.stopPropagation();
                lockScreen.remove();
                dialog.remove();
                $('#' + json.begin).hide();
            })

            /*$(document).click(function(){
             lockScreen.remove();
             dialog.remove();
             $('#'+json.begin).hide();
             })*/

            //在元素本身上点击不执行关闭 只要不冒泡到文档上就可以
            //操作元素本身 操作的是副本 因为追加进来的是副本 操作非副本事件无效
            cloneId.click(function (event) {
                event.stopPropagation();
            })
        }
    })
})(jQuery);

//提示组件
(function ($) {
    $.extend({
        Prompt: function (strPrams, fn) {
            if ($('.tc').length > 0) {
                return;
            } else {
                Tanchuang();
            }
            function Tanchuang() {
                var str = '';
                str = strPrams;
                var bod = $('body');
                bod.append('<div class="tc" style="opacity:0;padding:10px;height:30px;background:#000;color:#fff;position:fixed;bottom:0;left:0;border-radius:5px;line-height:30px;text-align:center;font-size:16px;z-index:9999;">' + str + '</div>');
                if ($('.tc')) {
                    $('.tc').css({
                        left: ($(window).width() - $('.tc').innerWidth()) / 2
                    });
                    $('.tc').stop().animate({
                        bottom: 100 + 'px',
                        opacity: 1
                    }, 200);
                }
                setTimeout(function () {
                    $('.tc').stop(true).animate({
                        bottom: 0 + 'px',
                        opacity: 0
                    }, 200, function () {
                        $('.tc').remove();
                        fn && fn();
                    })
                }, 1000)
            }
        }
    })
})(jQuery);

//ajaxLoading
var loading = ajaxLoading();

function ajaxLoading() {
    if ($('#ajaxLoading').length > 0) {
        return;
    }
    var ajaxLoading = $('<div id="ajaxLoading"><p></p></div>');
    ajaxLoading.css({
        height: $(window).height(),
        width: $(window).width(),
        position: 'fixed',
        top: 0,
        left: 0,
        opacity: .5,
        display: 'none',
        background: '#000',
        'z-index':9999
    });
    ajaxLoading.find('p').css({
        width: '60px',
        height: '60px',
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: '-30px',
        marginTop: '-30px',
        background: 'url("images/loading.gif")',
        backgroundSize: 'contain'
    });
    $('body').append(ajaxLoading);

    $(window).resize(function () {
        $("#ajaxLoading").css({
            height: $(window).height(),
            width: $(window).width(),
        })
    })
    return ajaxLoading;
}

//alert
function jalert(str, code, fn) {
    if ($(".odiv").length > 0) {
        return;
    }
    var odiv = $('<div class="odiv"><p>提示</p><p>' + str + '</p><div class="jbtn"></div>');
    if (code) {
        odiv.find(".jbtn").html('<a id="closed2">取消</a><a id="closed1">确定</a>')
    } else {
        odiv.find(".jbtn").html('<a id="closed1">确定</a>')
    }
    odiv.css({
        position: 'fixed',
        zIndex: '9999',
        width: '400px',
        height: '120px',
        background: '#fff',
        borderRadius: '5px',
        left: '50%',
        top: '50%',
        marginLeft: '-200px',
        marginTop: '-60px'
    });

    console.log($(odiv).width());
    odiv.find('p').css({
        textAlign: 'center',
        fontSize: '16px',
        marginTop: '10px'
    });
    odiv.find(".jbtn").css({
        position: 'absolute',
        width: '100%',
        height: '40px',
        bottom: '0px',
        textAlign: 'center',
        borderTop: '1px solid #dedede'
    });
    odiv.find(".jbtn").find('a').css({
        width: '150px',
        heihgt: '40px',
        textAlign: 'center',
        lineHeight: '40px',
        display: 'inline-block',
        fontSize: '16px',
        cursor: 'pointer'
    });
    var zhezhao = $("<div class='zhezhao'>");
    zhezhao.css({
        position: 'fixed',
        left: '0',
        top: '0',
        right: '0',
        bottom: '0',
        background: '#000',
        opacity: '0.1',
        zIndex: '9998'
    });

    odiv.appendTo($('body'));
    zhezhao.appendTo($('body'));

    odiv.find("#closed1").click(function (event) {
        event.stopPropagation();
        $(this).parents('.odiv').next().remove();
        $(this).parents('.odiv').remove();
        fn && fn($(this));
    });

    odiv.find("#closed2").click(function () {
        event.stopPropagation();
        $(this).parents('.odiv').next().remove();
        $(this).parents('.odiv').remove();
        fn && fn($(this));
    });
}

// 信息悬浮提示
function tips(el,content) {
    console.log(el)
    var x = 0;
    var y = 0;
    var qipao = $('<div id="qipao"><div class="tips_content"><div class="infor"></div></div><p></p></div>')
    if ($("#qipao").length > 0) {
        return
    }
    $("body").append(qipao)
    $("#qipao").css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '170px',
        height: 'auto',
        'min-height':'140px',
        background: '#656d78',
        '-moz-border-radius': '5px',
        '-webkit-border-radius': '5px',
        'border-radius': '5px',
        display:'none',
        'color':'#fff'
    })
    $("#qipao p").css({
        position: 'absolute',
        content: "",
        width: 0,
        height: 0,
        right: '100%',
        top: '20px',
        'border-top': '10px solid transparent',
        'border-right': '20px solid #656d78',
        'border-bottom': '10px solid transparent'
    })
    $(el).each(function () {
        $(this).mouseover(function (ev) {
            $("#qipao").show()
            var html=$(this).find('.tishiContent').html()
            $("#qipao .infor").html(html)
        })
        $(this).mousemove(function(ev){
            x = 20+event.clientX;
            y = 20+event.clientY;
            $("#qipao").css({
                top:y,
                left:x
            })
        })
        $(this).mouseout(function(){
            $("#qipao").hide()
        })
    })
}

//如果倒计时存在
function daojishi() {
    var count = getCookie('captcha') || 60;
    $('.getYan_zhuce').html(count + "s").attr('disabled', true)
    var resend = setInterval(function () {
        count--;
        if (count > 0) {
            $('.getYan_zhuce').html(count + "s").attr('disabled', true)
            setCookie('captcha', count, (1 / 86400) * count);
        } else {
            clearInterval(resend);
            $('.getYan_zhuce').html('获取').removeAttr('disabled');
            removeCookie('captcha');
        }
    }, 1000);
}

//类
function Bus(){
    //私有对象
    this._events={
        /*
         pp:[function(){},function(){}]
         * */
    }
}
//监听
Bus.prototype.on=function(eventName,callBack){
    //this._events[eventName]表示变量
    //this._events.eventName 表示字符串 表示真有这个属性
    //私有对象中有这个事件 表示不是第一次
    if(this._events[eventName]){
        //不是第一次就push方法   this._events={pp:[cry,shop,game]}
        this._events[eventName].push(callBack);
    }else{
        //第一次 对象中的属性=方法
        this._events[eventName]=[callBack] // this._events={ 'pp',[cry] }
    }
}
//发射
//...args剩余运算符
Bus.prototype.emit=function(eventName,...args){
    //[].slice.call(arguments,1)
    //Array.from(arguments).slice(1)
    if(this._events[eventName]){
        this._events[eventName].forEach((cb)=>{
            //实参中叫展开运算符
            //return cb(...args);
            return cb.apply(this,args)
        })
    }
}
//----------------------------------------------------------------------------
//实例化
let bus=new Bus()



