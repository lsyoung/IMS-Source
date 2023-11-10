import Vue from "vue";
import Vuex from "vuex";
import api from "./module/api";
import table from "./module/table";
import timer from "./module/timer";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */
const storeState = createPersistedState({
  paths: ["table"],
  storage: window.sessionStorage,
});

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      api,
      table,
      timer,
      // example
    },
    plugins: [
      createPersistedState({
        paths: ["table"],
        storage: window.sessionStorage,
      }),
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING,
  });

  return Store;
}
