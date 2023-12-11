<template>
  <q-layout view="lHh Lpr lFf" @click="onClickDisplay">
    <q-header style="height: 80px; background-color: #2F2F2F">
      <q-toolbar style="height: 100%">
          <q-icon name="fa-solid fa-circle-exclamation" class="text-light q-mr-sm" style="font-size: 1.55em" />
          <span class="text-h6 text-weight-bolder">
            주문방법
          </span>
          <span class="text-h6 text-weight-medium q-ml-md">
            메뉴선택
          </span>
          <q-icon name="fa-solid fa-circle-arrow-right q-mr-sm" class="text-light q-ml-sm" style="font-size: 1.55em" />
          <span class="text-h6 text-weight-medium q-ml-sm">
            장바구니
          </span>
          <q-icon name="fa-solid fa-circle-arrow-right q-mr-sm" class="text-light q-ml-sm" style="font-size: 1.55em" />
          <span class="text-h6 text-weight-medium q-ml-sm">
            주문완료
          </span>
        <q-space></q-space>
        <q-btn
          class="tableName bg-blue-6 text-weight-bolder"
          icon="fa-solid fa-bars"
          :label="this.getTableInfo.tbl_name"
          :ripple="false"
          flat
          @click="changeTable"
        ></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="200">
      <q-img src="../assets/logitech.jpg" style="margin-top: 10px" />
      <q-scroll-area style="height: calc(100vh - 270px); margin-top: 20px">
        <q-list>
          <q-item
            clickable
            v-for="list in menuList"
            :key="list.prdgrp_code"
            :active="clickMenu === list.prdgrp_code"
            @click="onMenuClicked(list.prdgrp_code)"
            active-class="my-menu-link bg-blue-6"
          >
            <q-item-section>
              {{ list.prdgrp_name }}
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <ul class="drawerBtn">
        <li>
          <q-btn
            id="orderList"
            label="주문내역"
            size="22px"
            icon="fa-solid fa-list-ul"
            @click="openOrderList()"
          />
        </li>
        <li>
          <q-btn
            id="addItem"
            label="장바구니"
            size="22px"
            icon="fa-solid fa-cart-shopping"
            @click="openBasket()"
          >
            <q-badge color="red" floating>{{ shoppingBasketCount }}</q-badge>
          </q-btn>
        </li>
      </ul>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <alert-dialog ref="refAlertPopup" />
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
.my-menu-link {
  color: white;
  /* background: #294380 !important; */
}
.q-list > .q-item {
  height: 55px;
  margin: 5px;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #e1e1e1;
  background: #fafafa;
}
.q-item__section {
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}
.drawerBtn {
  position: absolute;
  list-style: none;
  bottom: 2px;
  padding-left: 15px;
}
#orderList {
  background-color: #fff;
  color: #2196f3;
  font-weight: bold;
  height: 75px;
  margin-bottom: 15px;
}
#addItem {
  background-color: #2196f3;
  color: #fff;
  font-weight: bold;
  height: 75px;
}
.tableName {
  background-color: #2196f3;
  height: 55px;
  position: absolute;
  right: 12px;
  top: 12px;
  font-size: 20px;
}
</style>
