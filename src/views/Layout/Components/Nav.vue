<template>
    <div id="nav-wrap">
        <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
        <el-menu
          default-active="1-4-1"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          background-color="transparent"
          text-color="#fff"
          active-text-color="#fff"
          router
        >
            <template v-for="(item,index) in routers">
                <el-submenu v-if="!item.hidden" :key="item.id" :index="index +'' ">
                    <!--一级菜单-->
                    <template slot="title">
<!--                        <i :class="item.meta.icon"></i>-->
                        <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
                        <span slot="title">{{item.meta.name}}</span>
                    </template>
                    <!--子菜单-->
                    <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">{{subItem.meta.name}}</el-menu-item>
                </el-submenu>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import { reactive,ref,onMounted,computed } from '@vue/composition-api';
    export default {
        //compiler
        name: "navMenu",
        setup(props,{ root }){
            /**
             * data数据
             */
            const routers = reactive(root.$router.options.routes);
            /**
             * computed 监听
             */
            const isCollapse = computed(() => root.$store.state.isCollapse);
            return{
                isCollapse,
                routers
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "../../../styles/config";
.logo {
    text-align: center;
    img{
        margin: 28px auto 25px;
        width: 92px;
    }
}
#nav-wrap {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    background-color: #344a5f;
    @include webkit(transition, all .3s ease 0s);
    svg{
        font-size: 20px;
        margin-right: 10px;
    }
}
.open {
    #nav-wrap {width: $navMenu;}
}
.close {
    #nav-wrap {width: $navMenuMin;}
}
/*.el-menu-vertical-demo:not(.el-menu--collapse) {*/
/*    width: 200px;*/
/*    min-height: 400px;*/
/*}*/
</style>