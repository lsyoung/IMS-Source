import TableOrderLayout from "../layouts/TableOrderLayout.vue";
import KioskLayout from "../layouts/KioskLayout.vue";

const viewItems = {
  Index: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Table/Index.vue"),
  MenuList: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Table/MenuList.vue"),
  TableLoad: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Table/TableLoad.vue"),
  SaveTable: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Table/SaveTable.vue"),
    
// Kiosk
  KioskLoad: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Kiosk/KioskLoad.vue"),
  MainPage: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Kiosk/MainPage.vue"),
  MenuPage: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Kiosk/MenuPage.vue"),
  PayPage: () =>
    import(/* webpackChunkName: "group-foo" */ "../pages/Kiosk/PayPage.vue"),
};
const routes = [
  {
    path: "/tableLoad",
    component: () => import("src/pages/Table/TableLoad.vue"),
  },
  {
    path: "/",
    component: viewItems.Index,
  },
  {
    path: "/",
    component: TableOrderLayout,
    children: [
      {
        path: "menuList/:prdgrp_code",
        name: "MenuList",
        component: viewItems.MenuList,
        props: true,
      },
    ],
  },
  {
    path: "/saveTable",
    name: "SaveTable",
    component: viewItems.SaveTable,
  },
  // Kiosk
  {
    path: "/kioskLoad",
    component: () => import("src/pages/Kiosk/KioskLoad.vue"),
  },
  {
    path: "/mainPage",
    component: () => import("src/pages/Kiosk/MainPage.vue"),
  },
  {
    path: "/",
    component: KioskLayout,
    children: [
      {
        path: "menuPage",
        name: "MenuPage",
        component: viewItems.MenuPage,
      },
      {
        path: "/payPage",
        name: "PayPage",
        component: viewItems.PayPage,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
