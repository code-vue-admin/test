import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

//引入布局组件
import Layout from '@/views/Layout/index'

const routes = [
  {
    path: "/",
    redirect:"login",
    hidden:true,
    meta:{
      name:"主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden:true,
    meta:{
      name:"登录"
    },
    component: ()=> import("../views/Login/index")
  },
  {
    path: "/consoleIndex",
    name: "ConsoleIndex",
    redirect: "index",
    meta:{
      name:"控制台",
      icon:"console",
    },
    component: Layout,
    children:[
      {
        path: "/index",
        name: "Index",
        meta:{
          name:"首页"
        },
        component: ()=> import("../views/Console/index")
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    redirect: "index",
    meta:{
      name:"信息管理",
      icon: "info",
    },
    component: Layout,
    children:[
      {
        path: "/infoIndex",
        name: "InfoIndex",
        meta:{
          name:"信息列表"
        },
        component: ()=> import("../views/Info/index")
      },
      {
        path: "/infoCategory",
        name: "InfoCategory",
        meta:{
          name:"信息分类"
        },
        component: ()=> import("../views/Info/category")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    redirect: "index",
    meta:{
      name:"用户管理",
      icon: "user",
    },
    component: Layout,
    children:[
      {
        path: "/userIndex",
        name: "UserIndex",
        meta:{
          name:"用户列表"
        },
        component: ()=> import("../views/User/index")
      },
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;
