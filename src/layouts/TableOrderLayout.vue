<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="bg-grey-1 text-grey-8" bordered>
      <q-toolbar style="height: 65px;">
        <q-toolbar-title class="justify-center align-center" style="vertical-align: middle; align-items: center; justify-content: flex-start; display: flex;">
          <img src="~assets/imlogitech_logo.svg" width="auto" height="48px" class="q-ml-lg" >
          <q-separator vertical class="q-my-md q-mx-md" color="grey-9" />
          <span class="text-h6 text-grey-9">{{ storeName }}</span>
        </q-toolbar-title>

        <q-btn :label="this.getTableInfo.tbl_name" :ripple="false" dense flat @click="changeTable"  color="grey-1" text-color="grey-9" class="text-h6 q-mr-lg" />
      </q-toolbar>
    </q-header>

    <q-drawer class="bg-grey-5 text-grey-8" :width="250" show-if-above v-model="leftDrawerOpen" side="left" bordered :breakpoint="500">
      <q-list class="text-h6 q-mt-lg">
          <q-item 
            
            class="menu"
            active-class="active"
            clickable
            v-for="list in menuList"
            :key="list.prdgrp_code"
            :active="clickMenu === list.prdgrp_code"
            @click="onMenuClicked(list.prdgrp_code)">
            <q-item-section>
              {{ list.prdgrp_name }}
            </q-item-section>
          </q-item>
        </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    <alert-dialog ref="refAlertPopup" />
    </q-page-container>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right"
    :width="100" :breakpoint="500" class="bg-grey-1">
      <q-btn @click="openBasket()" color="primary" unelevated style="top: 6vh; right: 0; margin: 0; float: right; position: relative; border-top-right-radius: 0; border-bottom-right-radius: 0; border-top-left-radius: 15px; border-bottom-left-radius: 15px; width: 90%;">
        <div class="row items-center no-wrap" style="flex-direction: column; padding: 30vh 0;" text-color="grey-9">
          <q-icon name="shopping_basket" text-color="grey-9" />
          <div class="text-center">
            장바구니<br>
           <span class="text-h6 text-weight-bold">
            {{ shoppingBasketCount }}
            </span>
          </div>
        </div>
      </q-btn>
    </q-drawer>

    <q-footer class="bg-grey-4 text-grey-9" ref="footer">
      <q-toolbar>
        <div class="col-6 justify-center text-center">
          <q-btn style="width: 100%; font-size: 120%;" :ripple="false" dense unelevated flat color="grey-9" icon="view_list" label="주문 내역" @click="openOrderList()" />
        </div>
        <div class="col-6 justify-center text-center">
          <q-btn style="width: 100%; font-size: 120%;" :ripple="false" dense  unelevated flat color="grey-9" icon="content_paste" label="계산서" @click="OnReqOrder()" />
        </div>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import EventBus from "../utils/eventbus";
import extra from "src/utils/extra";
import AlertDialog from "src/components/AlertDialog.vue";
export default {
  name: "TableOrderLayout",

  components: { AlertDialog },
  data() {
    return {
      menuList: [],
      clickMenu: "",
      getTableInfo: "",
      getTabletInfo: "",
      storeName: "한우명가 한식 점문점",
      leftDrawerOpen: false,
      popUpData: {
        persistent: false,
        fixed: false,
      },
      orderPopUpData: {
        orderListPopUp: false,
        getOrderList: [],
      },
      shoppingBasketCount: 0,
      clickCount: 0,
      clickTimeSec: 10,
      timeout: "",
      displayTimeSec: "",
      displayTimeOut: "",
      displayTimeValue: 0,
      timeIsPause: false,
    };
  },
  created() {},
  mounted() {
    //테이블 설정페이지 이동하기
    if (this.$store.getters["table/tableInfo"].tbl_code == "") {
      this.$router.push({ path: "/saveTable" });
    } else {
      this.getTableInfo = this.$store.getters["table/tableInfo"];
    }
    //태블릿정보
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    this.getMainData();
    if (this.$router.history.current.params.prdgrp_code != undefined) {
      this.clickMenu = this.$router.history.current.params.prdgrp_code;
    }
    //장바구니 count
    EventBus.$on("getOrderLength", (data) => {
      this.shoppingBasketCount = data;
    });
    //타이머
    this.onClickDisplay();
  },
  beforeDestroy() {
    EventBus.$off("getOrderLength");
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
          timeout: 3000,
        });
        return;
      }
      this.menuList = result.CONT;
    },
    //메뉴그룹클릭
    onMenuClicked(code) {
      if (this.clickMenu == code) {
        return;
      }
      this.clickMenu = code;
      this.$router.push({
        name: "MenuList",
        params: { prdgrp_code: code },
      });
    },
    //장바구니열기
    openBasket() {
      this.popUpData.persistent = true;
      this.popUpData.fixed = true;
      EventBus.$emit("showBasket", this.popUpData);
    },
    
    OnReqOrder() {
      this.popUpData.persistent = true;
      this.popUpData.fixed = true;
      EventBus.$emit("showBasketList", this.popUpData);
    },
    
    openOrder() {
      this.popUpData.persistent = true;
      this.popUpData.fixed = true;
      EventBus.$emit("getOrderLength", this.popUpData);
    },
    //주문내역
    async openOrderList() {
      let param = {
        SP: "spj_sal_order",
        job_type: "SEL_TABLE",
        cust_code: this.getTabletInfo.cust_code,
        tbl_code: this.getTableInfo.tbl_code,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      if (result.CONT.length == 0) {
        extra.showAlert(this, "", "주문내역이없습니다.");
      } else {
        this.orderPopUpData.orderListPopUp = true;
        this.orderPopUpData.getOrderList = result.CONT;
        EventBus.$emit("showOrderList", this.orderPopUpData);
      }
    },
    changeTable() {
      this.startResetTimer();
      this.clickCount++;
      if (this.clickCount == 10) {
        this.$router.push({
          name: "SaveTable",
          query: {
            tbl_code: this.getTableInfo.tbl_code,
            tbl_name: this.getTableInfo.tbl_name,
          },
        });
      }
    },
    //테이블변경 타임
    startResetTimer() {
      clearTimeout(this.timeout); // 기존 타이머 제거
      this.timeout = setTimeout(this.resetClickCount, this.clickTimeSec * 100); // 새로운 타이머 설정
    },
    //테이블변경 클릭 수 리셋
    resetClickCount() {
      this.clickCount = 0;
    },
    //화면타이머
    onClickDisplay() {
      this.$store.dispatch("timer/handleScreenClick", "TABLE");
    },
  },
};
</script>
<style scoped>
.menu {
  margin: 10px 20px;
  position: relative;
  width: 210px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
}
.menu::after {
  font-family: "Material Icons";
    content: "\e5df";
  display: block;
  color: #e0e0e0;
  width: 28px;
  height: 28px;
  top: 16%;
  right: 0;
  position: absolute;
  border-radius: 10px;

}
.active {
  border: 1px solid !important;
  border-radius: 10px;
  margin-left: 30px;
  position: relative;
  width: 210px;
}
.active::after {
  font-family: "Material Icons";
    content: "\e5df";
  display: block;
  color: #DE5F50;
  width: 28px;
  height: 28px;
  top: 16%;
  right: 0;
  position: absolute;
  border-radius: 10px;

}
</style>
