const timer = {
  namespaced: true,
  state: {
    displayType: null,
    displayTimeOut: null,
    timeIsPause: false,
  },
  getters: {},
  mutations: {
    startTimer(state, param) {
      state.displayType = param;
      state.timeIsPause = false;
      console.log("state.startTimer", state.timeIsPause);
      clearTimeout(state.displayTimeOut);
      if (!state.timeIsPause && state.displayType == "TABLE") {
        state.displayTimeOut = setTimeout(() => {
          this.$router.push({ path: "/" });
        }, 1000000);
      } else if (!state.timeIsPause && state.displayType == "KIOSK") {
        state.displayTimeOut = setTimeout(() => {
          this.$router.push({ path: "/mainPage" });
        }, 500000);
      }
    },
    changeState(state) {
      state.timeIsPause = true;
      clearTimeout(state.displayTimeOut);
    },
  },
  actions: {
    handleScreenClick({ commit }, param) {
      commit("startTimer", param);
    },
    changeState({ commit }) {
      commit("changeState");
    },
  },
};

export default timer;
