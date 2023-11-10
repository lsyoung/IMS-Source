const table = {
  namespaced: true,
  state: {
    tbl_code: "",
    tbl_name: "",
    pos_code: "",
    cust_code: "",
  },
  getters: {
    tableInfo: (state) => {
      return {
        tbl_code: state.tbl_code,
        tbl_name: state.tbl_name,
      };
    },
    tabletInfo: (state) => {
      return {
        pos_code: state.pos_code,
        cust_code: state.cust_code,
      };
    },
  },
  mutations: {
    SET_TABLE(state, param) {
      state.tbl_code = param.tbl_code;
      state.tbl_name = param.tbl_name;
    },
    SET_TABLET(state, param) {
      state.pos_code = param.pos_code;
      state.cust_code = param.cust_code;
    },
  },
  actions: {
    setTable({ commit }, param) {
      commit("SET_TABLE", param);
    },
    setTablet({ commit }, param) {
      commit("SET_TABLET", param);
    },
  },
};

export default table;
