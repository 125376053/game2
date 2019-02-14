var api= 'https://www.babagame.vip' //正式
//var api = 'http://47.105.40.60:8082'
//var api = 'http://47.105.40.60:8092'
var userInfor=JSON.parse(window.localStorage.getItem('userInfor')) || null;
//取地址栏参数
function getSearchString(key) {
	// 获取URL中?之后的字符
	var str = location.search;
	str = str.substring(1,str.length);

	// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	var arr = str.split("&");
	var obj = new Object();

	// 将每一个数组元素以=分隔并赋给obj对象
	for(var i = 0; i < arr.length; i++) {
		var tmp_arr = arr[i].split("=");
		obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	}
	return obj[key];
}


//cookie
function setCookie(name,value,day){
    var date=new Date();//获取时间对象
    date.setDate(date.getDate()+day);//设置过期时间
    //设置cookie
    document.cookie=name+"="+value+";expires="+date;
}
function getCookie(name){
    var arr=document.cookie.split('; ');
    for(var i=0;i<arr.length;i++){
        var arr2=arr[i].split('=');
        if(arr2[0]==name){
            return arr2[1];
        }
    }
    return '';
}
function removeCookie(name){
    setCookie(name, '1', -1);
}

//提示组件
(function($){
	$.extend({
		Prompt:function(strPrams,fn){
			if($('.tc').length>0){
				return;
			}else{
				Tanchuang();
			}
			function Tanchuang() {
				var str = '';
				str = strPrams;
				var bod = $('body');
				bod.append('<div class="tc" style="opacity:0;padding:0 .25rem;height:.5rem;background:#000;color:#fff;position:fixed;bottom:0rem;left:0;border-radius:5px;line-height:0.5rem;text-align:center;font-size:0.14rem;z-index:9999;">' + str + '</div>');
				if ($('.tc')) {
					$('.tc').css({
						left:($(window).width()-$('.tc').innerWidth())/2
					});
					$('.tc').stop().animate({
						bottom: 0.5 + 'rem',
						opacity: 1
					}, 200);
				}
				setTimeout(function () {
					$('.tc').stop(true).animate({
						bottom: 0 + 'rem',
						opacity: 0
					}, 200, function () {
						$('.tc').remove();
						fn&&fn();
					})
				}, 1000)
			}
		}
	})
})(jQuery);

//ajaxLoading
var loading=ajaxLoading();
function ajaxLoading(){
	if($('#ajaxLoading').length>0){
		return;
	}
	var ajaxLoading=$('<div id="ajaxLoading"><p></p></div>');
	ajaxLoading.css({
		height:$(window).height(),
		width:$(window).width(),
		position:'fixed',
		top:0,
		left:0,
		opacity:.5,
		background:'#000',
		display:'none'
	});
	ajaxLoading.find('p').css({
		width:'1.24rem',
		height:'1.24rem',
		position:'absolute',
		top:'50%',
		left:'50%',
		marginLeft:'-.62rem',
		marginTop:'-.62rem',
		background:'url("images/loading.gif")',
		backgroundSize:'contain'
	});
	$('body').append(ajaxLoading);

	return ajaxLoading;
}

//alert
function jalert(str,code,fn){

	if($(".odiv").length>0){
		return;
	}

	var odiv=$('<div class="odiv"><p>提示</p><p>'+str+'</p><div class="jbtn"></div>');
	if(code){
		odiv.find(".jbtn").html('<a id="closed2">取消</a><a id="closed1">确定</a>')
	}else{
		odiv.find(".jbtn").html('<a id="closed1">确定</a>')
	}
	odiv.css({
		position:'fixed',
		zIndex:'9999',
		width:'80%',
		height:'3rem',
		background:'#fff',
		borderRadius:'5px',
		left:'50%',
		top:'50%',
		marginLeft:'-40%',
		marginTop:'-1.5rem'
	});

	console.log($(odiv).width());
	odiv.find('p').css({
		textAlign:'center',
		fontSize:'.32rem',
		marginTop:'.3rem'
	});
	odiv.find(".jbtn").css({
		position:'absolute',
		width:'100%',
		height:'1rem',
		bottom:'0rem',
		textAlign:'center',
		borderTop:'1px solid #dedede'
	});
	odiv.find(".jbtn").find('a').css({
		width:'2rem',
		heihgt:'1rem',
		textAlign:'center',
		lineHeight:'1rem',
		display:'inline-block',
		fontSize:'.32rem'
	});
	var zhezhao=$("<div class='zhezhao'>");
	zhezhao.css({
		position:'fixed',
		left:'0',
		top:'0',
		right:'0',
		bottom:'0',
		background:'#000',
		opacity:'0.1',
		zIndex:'9998'
	});

	odiv.appendTo($('body'));
	zhezhao.appendTo($('body'));

	odiv.find("#closed1").click(function(event){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});

	odiv.find("#closed2").click(function(){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});
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

