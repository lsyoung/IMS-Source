import axios from "axios";

const api = {
  namespaced: true,
  state: { packFlag: null },
  getters: {},
  mutations: {
    setPackFlag(state, param) {
      state.packFlag = param;
    },
  },
  actions: {
    // async loginApi({ commit }, apiParams) {
    //   let pname = apiParams.SP;
    //   delete apiParams.SP;
    //   try {
    //     let params = JSON.stringify(apiParams);
    //     let url =
    //       "http://175.118.126.36:10301/?PID=IMLOGITECH&PNAME=" +
    //       pname +
    //       "&PCONT=" +
    //       params;
    //     let resultAxios = await axios.get(url);

    //     if (resultAxios.status == 200) {
    //       this.dispatch("user/setUser", {
    //         user_id: apiParams.user_id,
    //         user_pass: apiParams.user_pass,
    //       });
    //     }
    //     return resultAxios.data;
    //   } catch {
    //     return { SUC: "0", MSG: "로그인처리 중 에러발생", CONT: [] };
    //   }
    // },
    async execApi({ commit }, apiParams) {
      let pname = apiParams.SP;
      delete apiParams.SP;
      try {
        let params = JSON.stringify(apiParams);
        params = encodeURIComponent(params);
        params = btoa(params);

        let url =
          "http://175.118.126.36:10801/?PID=IMLOGITECH&PNAME=" +
          pname +
          "&PCONT=" +
          params;
        const resultAxios = await axios.get(url);
        return resultAxios.data;
      } catch {
        return { SUC: "0", MSG: "데이터 요청 중 에러발생", CONT: [] };
      }
    },
    packFlag({ commit }, param) {
      commit("setPackFlag", param);
    },
  },
};

export default api;
