<template>
    <div class="mytabbar bordertop">
        <div v-for="(it, index) in tabdata" :key="index" class="tabbar">
            <div class="tabbardiv" @click.stop.prevent="iconclick(it.url)">
                <div class="tabbarimg">
                    <img v-if="$route.name === it.url" :src="it.active_img" alt="">
                    <img v-else :src="it.img" alt="">
                </div>
                <p :class="$route.name === it.url?'actives':''" class="tabbartext">{{ it.title }}</p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tabbar",
        data() {
            return {
                tabdata: [
                    { title: '主页', img: require('../assets/images/home.png'), active_img: require('../assets/images/active_home.png'), url: 'home' },
                    { title: '消息', img: require('../assets/images/new.png'), active_img: require('../assets/images/active_new.png'), url: 'personelnews' },
                    { title: '订单', img: require('../assets/images/order.png'), active_img: require('../assets/images/active_order.png'), url: 'orderDetails' },
                    { title: '我的', img: require('../assets/images/user.png'), active_img: require('../assets/images/active_user.png'), url: 'setting' }
                ]
            }
        },
        methods:{
            iconclick(name) {
                if (this.$route.name === name) {
                    return false
                } else {
                    this.$router.push({ name: name })
                }
            }
        }
    }
</script>

<style scoped>
    .mytabbar{
        position: fixed;
        z-index: 122;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 50px;
        display: flex;
        background-color: white;
    }
    .tabbar{
        flex: 1;
        font-size: 12px;
        padding-top: 2px;
        height: 100%;
        text-align: center;
    }
    .tabbardiv{
        height: 100%;
    }
    .tabbartext.actives{
        color: #FC744F;
    }
    .tabbarimg{
        height: 28px;
    }
    .tabbarimg img{
        height: 24px;
    }
    .tabbartext{
        color: #b6b6b6;
    }
</style>