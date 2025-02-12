// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [  
  {
    path: "/", 
    component: () =>
      import( "@/views/Login.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/Login.vue"),
  },
  {
     path: "/dashboard",
    name: "Dashboard",
    component: () =>   import(/* webpackChunkName: "home" */ "@/views/DashboardView.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/Home.vue"),
      },
      {
        path: "/category",
        name: "Category",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/category/Categories.vue"
          ),
      },   
      {
        path: "/priority",
        name: "Priority",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/priority/Priorities.vue"
          ),
      },
      {
        path: "/role",
        name: "Role",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/role/Role.vue"
          ),
      },{
        path: "/warehouse",
        name: "WareHouse",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/warehouse/WareHouse.vue"
          ),
      },
      {
        path: "/status",
        name: "Status",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/status/Statuses.vue"
          ),
      },
      {
        path: "/personwarehouse",
        name: "PersonWareHouse",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/personwarehouse/PersonWareHouse.vue"),
      },
      {
        path: "/product",
        name: "Product",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/product/Product.vue"),
      },
      {
        path: "/task",
        name: "Task",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/task/Tasks.vue"),
      },
      {
        path: "/salud",
        name: "Salud",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/salud/Salud.vue"),
      }, 
      {
        path: "/finance",
        name: "Finance",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/finance/Finance.vue"),
      },   
      {
        path: "/desire",
        name: "Desire",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/desire/Desire.vue"),
      },
      {
        path: "/file",
        name: "File",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/file/File.vue"),
      },
      {
        path: "/chat",
        name: "Chat",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/chat/Chat.vue"
          ),
      },
      {
        path: "/homes",
        name: "Homes",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/home/Home.vue"
          ),
      },
      {
        path: "/hometype",
        name: "Hometype",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/hometype/HomeType.vue"
          ),
      }  
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
