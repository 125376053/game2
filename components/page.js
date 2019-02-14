//全局组件
Vue.component('page', {
    template: `
        <div class="fenye pagination" id="page1" :style="{right:isFull?'0px':'300px'}"></div>
    `,
    props:['pages','isFull'],
    watch:{
        pages(a){
            console.log(a)
            var that=this
            Page({
                num:a,	//页码数
                startnum:1,				//指定页码
                elem:$('.fenye'),		//指定的元素
                callback:function(n){	//回调函数
                    console.log(n);
                    that.$root.page=n
                    that.$root.getData(that.$root.skey)
                }
            });
        }
    },
    data(){
        return {

        }
    },
    mounted(){
        bus.on('skey',(data)=>{
            console.log(data)
            this.$root.skey=data
        })
    },
    methods:{

    }
});


