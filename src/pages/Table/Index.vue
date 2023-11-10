<template>
  <div class="contain" @click="onMenuClicked(productGroupCode)">
    <q-img src="../../assets/logitech.jpg" class="mainImg" />
    <div class="alertCheck">
      <span>주문을 하시려면 화면을 터치해주세요.</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageIndex",
  data() {
    return {
      menuList: [],
      productGroupCode: "",
      getTabletInfo: "",
    };
  },
  mounted() {
    //태블릿정보
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    this.getMainData();
  },
  methods: {
    async getMainData() {
      let param = {
        SP: "spj_mst_prod_grp",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      if (result.SUC != 1) {
        this.$q.notify({
          type: "negative",
          message: result.MSG,
          position: "center",
          timeout: 1000,
        });
        return;
      }
      this.menuList = result.CONT;
      if (this.menuList.length != 0) {
        this.productGroupCode = this.menuList[0].prdgrp_code;
      }
    },
    onMenuClicked(code) {
      if (code == "") {
        return;
      }
      this.$router.push({
        name: "MenuList",
        params: { prdgrp_code: code },
      });
    },
  },
};
</script>
<style scoped>
.mainImg {
  width: 600px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.contain {
  height: 100vh;
  width: 100vw;
  position: relative;
}
.alertCheck {
  position: absolute;
  top: 70%;
  left: 50%;
  color: #555;
  font-size: 1.75rem;
  font-weight: 800;
  transform: translate(-50%, -70%);
}
</style>
