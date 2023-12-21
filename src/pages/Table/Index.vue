<template>
  <div class="container" @click="onMenuClicked(productGroupCode)">
    <div class="contain">
      <div class="row justify-center q-pa-lg">
        <div class="col-4 text-center q-pa-xl">
          <q-img src="../../assets/imlogitech_logo.svg" class="mainImg" />
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-12 text-center">
          <h1 class="storeName text-primary text-weight-bold">{{ storeName1 }}</h1>
          <h1 class="storeName text-secondary text-weight-bold">{{ storeName2 }}</h1>
        </div>
      </div>
      <div class="info row justify-center text-grey-8 text-weight-semibold text-h5">
        <span>주문을 하시려면 화면을 터치해주세요.</span>
      </div>
    </div>
    <div class="block">
      <div class="block--bg">
        <ul>
          <li class="block--item--menu q-py-sm">
            <img src="../../assets/home_icon_1.svg">
            <h2>뷰티·살롱</h2>
          </li>
          <li class="block--item--menu q-py-sm">
            <img src="../../assets/home_icon_2.svg">
            <h2>뷰티·살롱</h2>
          </li>
          <li class="block--item--menu q-py-sm">
            <img src="../../assets/home_icon_3.svg">
            <h2>뷰티·살롱</h2>
          </li>
          <li class="block--item--menu q-py-sm">
            <img src="../../assets/home_icon_4.svg">
            <h2>뷰티·살롱</h2>
          </li>
        </ul>

      </div>
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
      storeName1: "한우명가",
      storeName2: "한식 점문점",
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
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
}
.contain {
  height: 100%;
  width: 80%;
}
.block--bg {
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.6);
}
.block--bg::before {
  content: "";
  display: block;
  width: 11px;
  height: 238px;
  margin-left: -11px;
  background-color: #F96B5A;
  position: absolute;
  top: 35vh;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}
.block {
  height: 100%;
  width: 20%;
  background-image: url(../../assets/index_img.jpg);
  background-position: center center;
  background-repeat: no-repeat;
  justify-content: center;
  align-items: center;
}
.block ul {
  list-style: none;
  color: #fff;
  display: flex;
  margin: 0;
  padding: 1rem;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100%;
}
.block ul li {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  flex-direction: column;
}
.block ul li img {
  width: 60%;
  height: auto;
}
.block ul li h2 {
  font-weight: 700;
  font-size: 1.275rem;
  margin-top: 0;
}
.mainImg {
  width: 178px;
}
.storeName {
  font-size: 6.75rem;
}
</style>
