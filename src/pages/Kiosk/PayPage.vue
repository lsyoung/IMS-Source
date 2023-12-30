<template>
  <div>
    <div>
      <q-item class="row text-h5 text-grey-7 bg-grey-2 q-pa-lg" style="width: 100%;">
        <div class="col q-pl-md">
          <span> 메뉴 </span>
        </div>
        <div class="col text-right">
          <span> 수량 </span>
        </div>
        <div class="col text-right q-pr-md">
          <span> 가격 </span>
        </div>
      </q-item>
      <div style="width: 100%;" class="q-px-lg">
        <q-scroll-area class="scroll"
         style="height: calc(40vh); max-height: 100%">
          <!--  -->
            <q-card-section
              v-for="(menu, index) in shoppingBasket"
              :key="index"
            >
              <div class="row">
                <div class="col">
                  <div class="row" style="gap: 10px;">
                    <div class="col text-grey-9">
                      <span class="text-h6">{{ menu.prod_name }}</span>
                      <div>
                        <ul v-for="subOption in menu.menuOptionList" :key="subOption.setprod_code"
                        style="list-style: none; margin: 0; padding: 0; display: flex; gap: 10px; justify-content: stretch; width: 100%; flex-wrap: nowrap;">
                          <li>{{ subOption.setprod_name }}</li>
                          <li>{{ subOption.set_qty }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col text-h6 text-right q-pr-lg text-grey-9">
                  {{ menu.count }}
                </div>
                <div class="col text-h6 text-right text-grey-9">
                  {{ (menu.sel_price * menu.count) | currency }} 원
                </div>
              </div>
              <q-separator class="q-mt-md " />
            </q-card-section>
          <!--  -->
        </q-scroll-area>
      </div>
    </div>
    <div class="row text-h5 text-center text-weight-medium bg-indigo-11 text-white q-pa-lg">
      <div class="col text-left">총 금액</div>
      <div class="col text-right">
        {{ totalCount }}
      </div>
      <div class="col text-right">
        {{ formattedTotalPay }}원
      </div>
    </div>
    <div class="bg-red-2 text-center q-pa-xl">
      <b v-if="resetTime > 0" class="text-grey-9 text-weight-medium text-h4"
              >결제금액 ({{ resetTime }}초)
            </b>
    </div>
    <div class="text-h5 text-grey-7 text-center q-pa-lg">
      
    <span>결제수단을 선택해주세요.</span>
    </div>
    <div class="row q-pa-lg">
      <div class="col-6">
        <div>
          <q-btn
            unelevated
            class="row"
            color="primary"
            style="width: 100%; height: 190px; border-radius: 10px;"
            v-for="(item, index) in payMenu.filter((e) => e.mj_paygbn == 'CARD')"
            :key="index"
            @click="OnReqPayment(item.mj_paygbn)"
          >
            <div class="row self-start q-pt-sm text-h5 text-weight-medium" style="width: 100%;">
              <div class="col-6 text-left">카드 결제</div>
              <div class="col-6 text-right">
                <q-icon name="payment" />
              </div>
            </div>
            <div class="row text-left q-mt-xl" style="width: 100%;">
            {{ item.mj_paygbn_name }}

            </div>
            </q-btn
          >
        </div>
      </div>
      <div class="col-12 q-mt-md">
        <q-btn outline style="width: 100%;" label="취소" @click="back" />
      </div>
    </div>
      <!-- 카드만 놔두려고 filter 걸어둠 -->
    <!-- <div id="payMoney">
      <q-btn
        v-for="(item, index) in payMenu.filter((e) => e.mj_paygbn == 'CARD')"
        :key="index"
        outline
        id="money"
        @click="OnReqPayment(item.mj_paygbn)"
      >
        {{ item.mj_paygbn_name }}</q-btn
      >
    </div> -->

    <!--결제하고 난뒤에-->
    <!-- <div v-if="showReturnMessage" class="returnMessage">
      <span v-if="countDown > 0">
        <b>{{ countDown }}초</b> 뒤에 메인화면으로 돌아갑니다.
      </span>
    </div> -->

    <text-dialog ref="refAlertPopup" />
  </div>
</template>

<script>
import extra from "src/utils/extra";
import TextDialog from "src/components/TextDialog.vue";
import EventBus from "../../utils/eventbus";
import {imsidata} from './data'

export default {
  name: "PayPage",
  computed: {
    formattedTotalPay() {
      const totalPay = this.$route.params.totalPay || 0;
      return this.formatCurrency(totalPay);
    },
    
    totalCount() {
      let totalCount = 0;
      this.shoppingBasket.forEach((item, index, arr) => {
        totalCount += item.count;
      });
      return totalCount;
    },
  },
  components: { TextDialog },
  data() {
    return {
      showReturnMessage: false,
      //  countDown: 10, // 초기 카운트다운 시간 (5초)
      shoppingBasket: [],
      payMenu: [],
      inactivityTimer: null,
      resetTime: 100,
      getPackFlag: null,
      getTabletInfo: "",
      getPsr: "",
    };
  },
  mounted() {
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    this.getMainData();
    this.getPackFlag = this.$store.state.api.packFlag;
    const shoppingBasketParam = this.$route.params.shoppingBasket;
    
    if (shoppingBasketParam) {
      this.shoppingBasket = shoppingBasketParam;
    }

    this.backTimer();

    this.test();

    window.addEventListener("message", (e) => {
      const callInofs = e.data;

      if (callInofs.type !== "callFromJsToVue") {
        return;
      }

      if (callInofs.funcName === "paymentResult2") {
        extra.HideFullScreenLoading();
        const resp = callInofs.params;
        if (resp.respCode === 0) {
          const message = resp.respMesg;
          extra.showPopup(this, "ok", message);
        } else {
          extra.showPopup(this, "error", "결제 처리 중 오류가 발생하였습니다.");
        }
      }
    });
  },

  methods: {
    async getMainData() {
      let param = {
        SP: "spj_mst_pos_pay",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      //  console.log("psr", param);
      this.payMenu = result.CONT;
    },
    OnReqPayment(type) {
      if (type == "CARD") {
        this.paymentCard();
      }
      extra.ShowFullScreenLoading();

      // setTimeout(() => {
      //   // 타이머가 종료되면 실행될 부분
      //   this.showReturnMessage = true;

      //   let remainingTime = 10; // 카운트 시작 시간
      //   this.countDown = remainingTime; // 초기 표시

      //   const countdownInterval = setInterval(() => {
      //     remainingTime--;
      //     this.countDown = remainingTime;

      //     if (remainingTime === 0) {
      //       clearInterval(countdownInterval); // 카운트다운 종료 시 타이머 중단
      //       this.$router.push("/mainPage");
      //     }
      //   }, 1000); // 1초 간격으로 카운트다운 업데이트
      // }, 5000); // 5초
    },

    // 타이머
    backTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      this.inactivityTimer = setTimeout(() => {
        if (this.resetTime > 0) {
          this.resetTime--;
          this.backTimer(); // 다음 호출을 예약하여 카운트 다운을 유지
          if (this.resetTime === 0) {
            this.$router.push("/mainPage");
          }
          
        EventBus.$emit("changeTime", this.resetTime);
        }
      }, 1000); // 1초마다 체크
    },

    resetTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      this.resetTime = 30; // 타이머 초기화
      this.backTimer(); // 타이머 다시 시작
    },

    back() {
      clearTimeout(this.inactivityTimer);
      this.$router.push("/menuPage");
    },

    formatCurrency(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // 카드 결제
    async paymentCard() {
      if (this.balance == 0) return false;
      this.callEasyChkPayment();

      EventBus.$on("errResult", async (result) => {
        this.$q.notify({
          type: "negative",
          message: result.RS16,
          position: "center",
          timeout: 2000,
        });
        extra.HideFullScreenLoading();
        EventBus.$off("errResult");
        return;
      })

      let payResult;
      EventBus.$on("result", async (result1) => {
        payResult = result1;
        let param = {
          SP: "spj_sal_order",
          job_type: "INS",
          cust_code: this.getTabletInfo.cust_code,
          pos_code: this.getTabletInfo.pos_code,
          pre_paid_flag: "1",
          pack_flag: this.getPackFlag,
          update_id: "S0000001",
          sal_order: [], // 불필요한 값 확인 필요
          sal_payment: [
            {
              mj_paytype: "CARD",
              amt_pay: this.$route.params.totalPay,
              mj_van: payResult.RQ17,
              card_no: payResult.RQ04,
              ok_no: payResult.RS09,
              ok_datetime: payResult.RS07,
              inst_month: payResult.RQ06,
              card_company: payResult.RS14,
              card_name: payResult.RS12,
              creater_no: payResult.RS13,
              creater_bizno: payResult.RS19,
            },
          ],
        };
        let menuInfo = {
          prod_code: "",
          prod_name: "",
          sel_price: 0,
          qty: 0,
          service_flag: "",
          order_set_json: [],
        };
        let optionData = {
          prod_code: "",
          prod_name: "",
          price: "",
          qty: "",
        };
        for (let menu in this.shoppingBasket) {
          menuInfo.prod_code = this.shoppingBasket[menu].prod_code;
          menuInfo.prod_name = this.shoppingBasket[menu].prod_name;
          menuInfo.sel_price = this.shoppingBasket[menu].sel_price;
          menuInfo.qty = this.shoppingBasket[menu].count;
          menuInfo.service_flag = "0";
          menuInfo.order_set_json = [];
          if (this.shoppingBasket[menu].menuOptionList.length != 0) {
            for (let option in this.shoppingBasket[menu].menuOptionList) {
              optionData.prod_code =
                this.shoppingBasket[menu].menuOptionList[option].setprod_code;
              optionData.prod_name =
                this.shoppingBasket[menu].menuOptionList[option].setprod_name;
              optionData.price =
                this.shoppingBasket[menu].menuOptionList[option].set_price;
              optionData.qty =
                this.shoppingBasket[menu].menuOptionList[option].set_qty;
              menuInfo.order_set_json.push({ ...optionData });
            }
            param.sal_order.push({ ...menuInfo });
          } else {
            menuInfo.order_set_json = "NULL";
            param.sal_order.push({ ...menuInfo });
          }
        }
        const result = await this.$store.dispatch("api/execApi", param);
        this.getPsr = result.CONT[0].psr;

        EventBus.$off("result");
        extra.HideFullScreenLoading();
        this.custBill();
        return;
      });
    },

    test() {
      extra.callToExternalFunction("kioskPayResult", imsidata); // C#으로 kiosk 결제내역 소켓통신하도록
    },

    // 영수증
    async custBill() {
      let param1 = {
        SP: "spj_sch_order",
        job_type: "REPSHT",
        cust_code: this.getTabletInfo.cust_code,
        psr: this.getPsr,
      };
      const result1 = await this.$store.dispatch("api/execApi", param1);
      this.receiptCust = result1.CONT[0];
      this.receiptCust.payInfo = [];
      this.receiptCust.orderInfo = [];

      let param2 = {
        SP: "spj_sch_order",
        job_type: "PAYSHT",
        cust_code: this.getTabletInfo.cust_code,
        psr: this.getPsr,
      };
      const result2 = await this.$store.dispatch("api/execApi", param2);
      this.receiptList = result2.CONT;
      this.receiptList.forEach((pay) => {
        this.receiptCust.payInfo.push(pay);
      });

      let param3 = {
        SP: "spj_sch_order",
        job_type: "ORDSHT",
        cust_code: this.getTabletInfo.cust_code,
        order_no: this.receiptCust.order_no,
      };
      const result3 = await this.$store.dispatch("api/execApi", param3);
      this.tableData = result3.CONT;
      this.tableData.forEach((order) => {
        this.receiptCust.orderInfo.push(order);
      });

      let toCsharpresult = [];
      toCsharpresult.push(this.receiptCust)
      // C#으로 결제정보 보내기 필요
      extra.callToExternalFunction("kioskPayResult", toCsharpresult); // C#으로 kiosk 결제내역 소켓통신하도록

      this.$router.push("/mainPage");
    },

    callEasyChkPayment() {
      const option = {
        S_RQ01: "D1", // 전문구분
        S_RQ02: this.$route.params.totalPay, // 금액
        S_RQ03: "00", // 할부
        S_RQ04: "20", // 타임아웃
        S_RQ05: "A", // 부가세
      };
      extra.callToPayment(option);
    },
  },
  filters: {
    currency(pay) {
      return pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<!-- <style>
#payMoney {
  padding-top: 100px;
  padding-left: 23px;
  justify-content: space-between;
}
#money {
  margin-right: 10px;
  margin-bottom: 12px;
  border-radius: 3%;
  width: 48%;
  height: 400px;
  font-size: 38px;
}
#cancelBtn {
  width: 70%;
  height: 120px;
  margin-top: 10%;
  margin-left: 15%;
  font-size: 30px;
  border-radius: 3%;
}
.total {
  font-size: 40px;
  margin-left: 3%;
}
.returnMessage {
  text-align: center;
  font-size: 34px;
  padding-top: 60px;
  color: #333;
}
</style> -->
