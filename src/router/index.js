// Composables
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import(/* webpackChunkName: "home" */ "@/views/Login.vue"),
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: () =>
      import(/* webpackChunkName: "home" */ "@/views/DashboardView.vue"),
    children: [
      {
        path: "/onboarding",
        name: "Onboarding",
        component: () =>
          import(
            /* webpackChunkName: "onboarding" */ "@/views/onboarding/Onboarding.vue"
          ),
        //meta: { requiresAuth: true } // Si usas protección de rutas
      },
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
          import(/* webpackChunkName: "home" */ "@/views/role/Role.vue"),
      },
      {
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
          import(/* webpackChunkName: "home" */ "@/views/status/Statuses.vue"),
      },
      {
        path: "/personwarehouse",
        name: "PersonWareHouse",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/personwarehouse/PersonWareHouse.vue"
          ),
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
        path: "/goals",
        name: "Goals",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/goal/Goals.vue"),
      },
      {
        path: "/health",
        name: "Health",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/salud/History.vue"),
      },
      {
        path: "/consultation",
        name: "Consultas",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/salud/Consultation.vue"
          ),
      },
      {
        path: "/exam",
        name: "Examenes",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/salud/Exams.vue"),
      },
      {
        path: "/emergency",
        name: "Emergencias",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/salud/Emergency.vue"),
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
          import(/* webpackChunkName: "home" */ "@/views/chat/Chat.vue"),
      },
      {
        path: "/chatTask",
        name: "ChatTask",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/chat/ChatTask.vue"),
      },
      {
        path: "/suggestions",
        name: "Suggestions",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/suggestion/Suggestion.vue"
          ),
      },
      {
        path: "/homes",
        name: "Homes",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/home/Home.vue"),
      },
      {
        path: "/hometype",
        name: "Hometype",
        component: () =>
          import(
            /* webpackChunkName: "home" */ "@/views/hometype/HomeType.vue"
          ),
      },
      {
        path: "/type",
        name: "Type",
        component: () =>
          import(/* webpackChunkName: "home" */ "@/views/type/Types.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
