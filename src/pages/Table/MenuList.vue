<template>
  <div class="wrap">
    <q-scroll-area style="height: calc(100vh - 80px); padding: 6px 0px">
      <div class="row">
        <div class="col bg-3">
          <div class="row" id="scrollRow">
            <div
              class="col-4 colCard"
              v-for="item in groupMenu"
              :key="item.prod_code"
            >
              <q-card
                class="menuCard"
                flat
                bordered
                :disable="item.soldout_flag == '1'"
                @click="OnMenuClick(item)"
              >
                <q-img :src="item.prod_image" :ratio="4 / 3">
                  <div
                    class="absolute-full flex flex-center"
                    v-if="item.soldout_flag == '1'"
                  >
                    <q-chip
                      square
                      color="red"
                      text-color="white"
                      label="주문불가"
                    />
                  </div>
                  <q-chip
                    class="absolute-bottom-right menuChip"
                    square
                    text-color="white"
                    label="신상품"
                    icon="fa-solid fa-star"
                    v-if="item.new_flag == 1"
                  />
                  <q-chip
                    class="absolute-bottom-left menuChip"
                    square
                    text-color="white"
                    label="추천"
                    icon="fa-solid fa-thumbs-up"
                    v-if="item.recmd_flag == 1"
                  />
                </q-img>
                <q-card-section class="q-pt-none nameSection">
                  <div class="subtitle1">
                    {{ item.prod_name }}
                  </div>
                  <div
                    class="text-subtitle2"
                    style="text-align: center; margin-bottom: 5px"
                  >
                    <span class="org_price" v-if="item.dc_price != 0">
                      <del>{{ item.price | money }}원</del>
                    </span>
                    <span class="dis_price">
                      <ins>{{ item.sel_price | money }}원</ins>
                    </span>
                  </div>
                </q-card-section>
                <q-separator />
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </q-scroll-area>
    <q-dialog
      v-model="menuClickPopup"
      persistent
      fullWidth
      fullHeight
      @click="onClickDisplay"
    >
      <q-card>
        <q-toolbar-title
          style="text-align: center; background-color: #294380; color: #fff"
        >
          상품정보
        </q-toolbar-title>
        <div class="row">
          <div class="col-4 q-pa-md">
            <q-img :src="clickedItem.prod_image" :ratio="4 / 3" />
            <div
              class="q-mt-sm text-weight-bolder"
              style="font-size: 24px; text-align: center"
            >
              {{ clickedItem.prod_name }}
            </div>
            <div class="text-body2 q-mt-sm" style="color: #616161">
              {{ clickedItem.prod_comment }}
            </div>
            <div class="menuCount">
              <q-btn
                outline
                dense
                size="22px"
                :ripple="false"
                icon="remove"
                @click="OnMenuCountRemove(clickedItem)"
              />
              <input
                v-model="clickedItem.count"
                readonly
                style="
                  width: 50px;
                  text-align: center;
                  border: none;
                  font-size: 24px;
                "
              />
              <q-btn
                outline
                dense
                size="22px"
                :ripple="false"
                icon="add"
                @click="OnMenuCountAdd(clickedItem)"
              />
            </div>
            <div class="text-h5 text-center text-weight-bold menuPrice">
              {{
                ((clickedItem.sel_price + clickOptionPrice + optionSetPrice) *
                  clickedItem.count)
                  | money
              }}

              원
            </div>
          </div>
          <q-separator
            vertical
            style="height: calc(100vh - 80px); max-height: 83vh"
          />
          <div class="col">
            <q-scroll-area
              style="height: calc(100vh - 170px); max-height: 80vh"
            >
              <q-card-section
                class="optionSection"
                v-for="item in optionGroup"
                :key="item.setgrp_code"
              >
                <span class="text-h6 text-weight-bold">
                  {{ item.setgrp_name }}
                </span>
                <span
                  class="text-subtitle2 text-weight-bolder"
                  style="color: #ff5350"
                  v-if="item.must_flag == '1'"
                >
                  필수선택 {{ item.opt_cnt }}개
                </span>
                <div class="checkGroup">
                  <div
                    class="inputBox"
                    v-for="optionItem in item.optionList"
                    :key="optionItem.setprod_code"
                  >
                    <q-checkbox
                      size="75px"
                      keep-color
                      color="indigo-10"
                      v-model="optionItem.chk_flag"
                      :label="optionItem.setprod_name"
                      :disable="optionItem.soldout_flag == '1'"
                      @input="optionClick(item, optionItem)"
                    />
                    <q-chip
                      color="red"
                      text-color="white"
                      label="품절"
                      v-if="optionItem.soldout_flag == '1'"
                    />
                    <div class="optionCount">
                      {{ optionItem.set_price | money }}원
                    </div>
                    <div id="optionBtn" v-if="optionItem.qty_edit_flag == 1">
                      <q-btn
                        outline
                        dense
                        size="20px"
                        :ripple="false"
                        icon="remove"
                        @click="OnOptionCountRemove(optionItem)"
                      />
                      <input
                        v-model="optionItem.set_qty"
                        readonly
                        style="
                          width: 50px;
                          text-align: center;
                          border: none;
                          font-size: 24px;
                        "
                      />
                      <q-btn
                        outline
                        dense
                        size="20px"
                        :ripple="false"
                        icon="add"
                        @click="OnOptionCountAdd(item, optionItem)"
                      />
                    </div>
                  </div>
                </div>
                <q-separator />
              </q-card-section>
            </q-scroll-area>
          </div>
          <div class="col q-gutter-x-md orderBtnBox">
            <q-btn
              class="cancleBtn"
              label="취소"
              flat
              @click="meunPopUpClose"
            />
            <q-btn
              class="addCartBtn"
              label="장바구니담기"
              flat
              @click="OnAppendToBasket(clickedItem, optionGroup)"
            ></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="persistent"
      persistent
      full-height
      :position="position"
      transition-show="scale"
      transition-hide="scale"
      fixed
      @click="onClickDisplay"
    >
      <q-card class="my-card" style="width: 600px; max-width: 55vw">
        <q-item class="cardHeader">
          <q-item-section>
            <strong class="cartName q-ml-md">장바구니</strong>
          </q-item-section>
          <q-item-section>
            <q-btn
              class="removeItemBtn"
              rounded
              flat
              label="장바구니비우기"
              @click="removeItems(shoppingBasket)"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <q-card-section
          class="scroll q-pt-none basketScroll"
          style="max-height: 67vh; height: 560px"
        >
          <q-table
            class="my-sticky-table"
            :data="shoppingBasket"
            :columns="shoppingBasketColumns"
            :pagination.sync="pagination"
            hide-header
            hide-bottom
            flat
            virtual-scroll
          >
            <template v-slot:body="dataRow">
              <q-tr :props="dataRow" no-hover>
                <q-td>
                  <div class="my-table-details q-my-sm">
                    {{ dataRow.row.prod_name }}
                  </div>
                  <div class="optionTd">
                    <div class="optionCountTd">
                      <q-btn
                        class="removeBtn q-mr-xs"
                        outline
                        dense
                        size="20px"
                        :ripple="false"
                        icon="remove"
                        @click="OnMenuCountRemove(dataRow.row)"
                      />
                      <input
                        v-model="dataRow.row.count"
                        readonly
                        style="
                          width: 50px;
                          text-align: center;
                          border: none;
                          font-size: 24px;
                        "
                      />
                      <q-btn
                        outline
                        dense
                        size="20px"
                        :ripple="false"
                        icon="add"
                        @click="OnMenuCountAdd(dataRow.row)"
                      />
                    </div>
                    <div style="width: 220px">
                      <ul
                        class="optionUl"
                        v-for="item in dataRow.row.menuOptionList"
                        v-bind:key="item.setprod_code"
                      >
                        <li>{{ item.setprod_name }}</li>
                        <li>{{ item.set_qty }}</li>
                        <li>{{ item.set_price | money }}원</li>
                      </ul>
                    </div>
                  </div>
                </q-td>
                <q-td key="countPay" :props="dataRow">
                  <div>
                    <q-btn
                      class="removeOneItem"
                      round
                      size="16px"
                      text-color="white"
                      icon="fas fa-xmark"
                      @click="removeOneItem(dataRow.row)"
                    />
                    <div class="tdTotalPay q-mt-sm">
                      {{ (dataRow.row.sel_price * dataRow.row.count) | money }}
                      원
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <div class="cartTotalBox">
          <div class="cartSpan">
            <span class="q-ml-sm">
              주문수량
              <input class="totalCount" v-model="totalCount" readonly />
              개
            </span>
            <span>
              합계
              <input
                class="totalPay q-ml-sm"
                type="text"
                :value="totalPay | money"
                readonly
              />
              원
            </span>
          </div>
          <div>
            <q-btn
              class="addProductBtn"
              label="더담기"
              @click="addProductBtn"
              v-close-popup
            />
            <q-btn
              class="cartOrderBtn"
              label="주문하기"
              @click="OnReqOrder"
            ></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>

    <!-- 주문화면 한번 더 체크 -->
    <q-dialog
      v-model="doubleChkingValue"
      persistent
      fullHeight
      fullWidth
      @click="onClickDisplay"
    >
      <q-card>
        <div class="row">
          <div class="col-5 alertCheck">
            <span>주문서 확인 후 주문확정해주세요.</span>
          </div>
          <q-separator
            vertical
            style="height: calc(100vh - 48px); background: #f6f6f9"
          />
          <div
            class="col"
            style="padding: 50px 20px 10px 40px; background-color: #f6f6f9"
          >
            <div
              style="
                border-radius: 1.25em;
                height: calc(100vh - 190px);
                background-color: #fff;
              "
            >
              <div class="alertList">주문서</div>
              <q-item class="cardQitem">
                <div>
                  <span> 메뉴 </span>
                </div>
                <div>
                  <span> 수량 </span>
                </div>
                <div>
                  <span> 가격 </span>
                </div>
              </q-item>
              <q-scroll-area
                style="height: calc(100vh - 350px)"
                class="menuSectionScroll"
              >
                <q-card-section
                  v-for="(menu, index) in shoppingBasket"
                  :key="index"
                  style="padding: 5px 16px 0px"
                >
                  <div class="menuSection">
                    <span
                      >{{ menu.prod_name }}
                      <div>
                        <ul
                          class="orderOptionUl"
                          v-for="subOption in menu.menuOptionList"
                          :key="subOption.setprod_code"
                        >
                          <li>{{ subOption.setprod_name }}</li>
                          <li>{{ subOption.set_qty }}</li>
                        </ul>
                      </div>
                    </span>
                    <div class="menuCountSection">
                      {{ menu.count }}
                    </div>
                    <div class="menuTotalAmt">
                      {{ (menu.sel_price * menu.count) | money }}원
                    </div>
                  </div>
                  <q-separator />
                </q-card-section>
              </q-scroll-area>
              <q-item class="priceQitem">
                <div class="priceBox">
                  <span> 합계 </span>
                </div>
                <div class="boxItem">
                  <span> {{ totalCount }}</span>
                  <span> {{ totalPay | money }}</span>
                </div>
              </q-item>
            </div>
          </div>
          <div class="col q-gutter-x-md orderBtnBox">
            <q-btn class="cancleBtn" label="취소" flat v-close-popup />
            <q-btn
              class="addCartBtn"
              label="주문확정"
              flat
              @click="confirmOrder"
            />
          </div>
        </div>
      </q-card>
    </q-dialog>
    <!-- <q-dialog v-model="doubleChkingValue">
      <q-card style="width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            상품결제가 완료되었습니다.
            <span
              v-if="remainingTime > 0"
              class="text-caption"
              style="font-size: 20px"
            >
              ({{ remainingTime }}초)
            </span>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-lg text-h5 flex column">
          <p class="salesValues">
            <span>주문 금액</span><span>{{ totalPay | money }}원</span>
          </p>
          <p class="salesValues">
            <span>누적 금액</span><span>{{ payPrice | money }}원</span>
          </p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="닫기"
            color="primary"
            v-close-popup
            @click="doubleChkingValue = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog> -->
    <!-- 주문내역 -->
    <q-dialog
      v-model="orderListPopUp"
      persistent
      full-height
      fullWidth
      @click="onClickDisplay"
    >
      <q-card>
        <q-toolbar-title
          style="text-align: center; background-color: #294380; color: #fff"
        >
          주문내역
        </q-toolbar-title>
        <q-card-section
          class="scroll basketScroll"
          style="max-height: 80vh; height: 100%"
        >
          <q-table
            class="resultTable"
            :data="getOrderList"
            :columns="orderListColumns"
            :pagination.sync="pagination"
            hide-header
            hide-bottom
            flat
            virtual-scroll
          >
            <template v-slot:body="props">
              <q-tr :props="props" no-hover>
                <q-td>
                  <div style="display: flex">
                    <div class="rowProdName">
                      {{ props.row.prod_name }}
                    </div>
                    <div style="width: 250px; margin: 0 2em">
                      <ul
                        class="orderOptionUl"
                        v-if="props.row.prod_set[0].prod_code != undefined"
                        v-for="subOption in props.row.prod_set"
                        :key="subOption.prod_code"
                      >
                        <li>{{ subOption.prod_name }}</li>
                        <li>{{ subOption.qty }}</li>
                        <li>{{ subOption.price | money }}원</li>
                      </ul>
                    </div>
                    <div class="rowProdQty">{{ props.row.qty }}개</div>
                    <div class="rowProdPrice">
                      {{ props.row.amt_tot | money }}원
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <div class="orderTotalBox">
          <div class="orderSpan">
            <span>
              주문 수량
              <input class="totalCount" v-model="payCount" readonly />개
            </span>
            <span> 합계 {{ payPrice | money }}원 </span>
          </div>
        </div>
        <q-btn class="checkOrderList" label="확인" v-close-popup />
      </q-card>
    </q-dialog>
    <alert-dialog ref="refAlertPopup" />
  </div>
</template>

<script>
import EventBus from "../../utils/eventbus";
import extra from "src/utils/extra";
import AlertDialog from "src/components/AlertDialog.vue";
import OrderPrint from "src/utils/OrderPrint";

export default {
  name: "MenuList",
  props: {
    prdgrp_code: String,
  },
  components: { AlertDialog },
  created() {
    //태블릿정보
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    //테이블정보
    this.getTableInfo = this.$store.getters["table/tableInfo"];
    this.getMainData();
  },
  mounted() {
    //장바구니 popup
    EventBus.$on("showBasket", (data) => {
      this.persistent = data.persistent;
      this.fixed = data.fixed;
    });
    //주문내역 popup
    EventBus.$on("showOrderList", (data) => {
      this.orderListPopUp = data.orderListPopUp;
      this.getOrderList = data.getOrderList;
    });

    //안드로이드 연동
    window.addEventListener("message", (e) => {
      const callInofs = e.data;
      if (callInofs.type !== "callFromJsToVue") {
        return;
      }

      // 결제 처리 결과 회신
      if (callInofs.funcName === "paymentCardResult") {
        extra.HideFullScreenLoading();
        const resp = callInofs.params;
        if (resp.respCode === 0) {
          const message = resp.respMesg;
          console.log(resp.respData)
          this.OnPaymentCardResult(resp.respData);
        } else {
          extra.showPopup(this, "error", "결제 처리 중 오류가 발생하였습니다.");
        }
      }
    });
  },
  beforeDestroy() {
    EventBus.$off("showBasket");
    EventBus.$off("showOrderList");
  },
  data() {
    return {
      groupMenu: [],
      shoppingBasket: [],
      getOrderList: [],
      optionGroup: [],
      optionList: [],
      menuOptionList: [],
      getTableInfo: "",
      getTabletInfo: "",
      groupCode: this.prdgrp_code,
      clickOptionPrice: 0,
      optionCount: 0,
      optionSetPrice: 0,
      menuClickPopup: false,
      orderListPopUp: false,
      persistent: false,
      position: "right",
      doubleChkingValue: false,
      inactivityTimer: null,
      remainingTime: 60,
      pagination: {
        rowsPerPage: 0,
      },
      clickedItem: {
        count: 1,
      },
      shoppingBasketColumns: [
        {
          name: "prod_name",
          required: true,
          label: "메뉴명",
          align: "center",
          field: "prod_name",
          sortable: true,
        },
        {
          name: "price",
          required: true,
          align: "center",
          label: "가격",
          field: "price",
          sortable: true,
        },
        {
          name: "count",
          align: "center",
          label: "수량",
          field: "count",
          sortable: true,
        },
        {
          name: "menuOptionList",
          align: "center",
          label: "옵션",
          field: "menuOptionList",
          sortable: true,
        },
        {
          name: "countPay",
          align: "center",
          label: "수량가격",
          field: "countPay",
          sortable: true,
        },
        {
          name: "",
          align: "center",
          label: "",
          field: "",
          sortable: true,
        },
      ],
      orderListColumns: [
        {
          name: "prod_name",
          required: true,
          label: "메뉴명",
          align: "center",
          field: "prod_name",
          sortable: true,
        },
        {
          name: "price",
          required: true,
          align: "center",
          label: "가격",
          field: "price",
          sortable: true,
        },
        {
          name: "amt_dc",
          required: true,
          align: "center",
          label: "힐인가",
          field: "amt_dc",
          sortable: false,
        },
        {
          name: "qty",
          align: "center",
          label: "수량",
          field: "qty",
          sortable: false,
        },
        {
          name: "amt_tot",
          align: "center",
          label: "총금액",
          field: "amt_tot",
          sortable: false,
        },
      ],
    };
  },
  methods: {
    async getMainData() {
      let param = {
        SP: "spj_mst_prod_grp_prod",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
        prdgrp_code: this.groupCode,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      this.groupMenu = result.CONT;
    },
    //주문하기
    async OnMenuClick(item) {
      this.$store.dispatch("timer/handleScreenClick", "TABLE");
      if (item.soldout_flag == "1") {
        this.menuClickPopup = false;
        return;
      }
      let param = {
        SP: "spj_mst_prod_set_grp",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        prod_code: item.prod_code,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      this.optionGroup = result.CONT;

      let param1 = {
        SP: "spj_mst_prod_set_grp_prod",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        prod_code: item.prod_code,
      };
      const result1 = await this.$store.dispatch("api/execApi", param1);
      this.optionList = result1.CONT;

      for (let idx = 0; idx < this.optionGroup.length; idx++) {
        const optionGroup = this.optionGroup[idx];
        optionGroup.optionList = [];

        this.optionList.forEach((optionMenuItem) => {
          if (optionMenuItem.setgrp_code === optionGroup.setgrp_code) {
            if (
              optionMenuItem.basic_flag === "1" &&
              optionMenuItem.soldout_flag != "1"
            ) {
              optionMenuItem.chk_flag = true;
            } else {
              optionMenuItem.chk_flag = false;
            }
            optionGroup.optionList.push(optionMenuItem);
          }
        });
      }
      this.clickedItem = {
        ...item,
        count: 1,
      };

      this.menuClickPopup = true;
    },
    //주문수량빼기버튼
    OnMenuCountRemove(item) {
      let count = item.count;
      if (count > 1) {
        count -= 1;
      }
      item.count = count;
    },
    //주문수량더하기
    OnMenuCountAdd(item) {
      let count = item.count;
      count += 1;
      item.count = count;
    },
    //장바구니담기
    OnAppendToBasket(item, optionGroup) {
      let totalMenuPrice =
        item.sel_price + this.clickOptionPrice + this.optionSetPrice;
      let optionBasket = [];
      for (let i = 0; i < optionGroup.length; i++) {
        const optionItem = optionGroup[i];
        const optionCount = optionItem.opt_cnt;

        let checkedCount = 0;
        optionItem.optionList.forEach((oneOption) => {
          if (oneOption.chk_flag == true && oneOption.set_qty > 1) {
            checkedCount += oneOption.set_qty;
            optionBasket.push(oneOption);
          } else if (oneOption.chk_flag == true) {
            checkedCount += 1;
            optionBasket.push(oneOption);
          }
        });

        if (
          optionItem.must_flag == "1" &&
          (optionCount > checkedCount || optionCount < checkedCount)
        ) {
          this.$q.notify({
            message:
              "'" +
              optionItem.setgrp_name +
              "' " +
              optionItem.opt_cnt +
              "개 선택하세요.",
            color: "indigo-10",
            position: "center",
            icon: "announcement",
            timeout: 500,
            textColor: "white",
            actions: [{ label: "확인", color: "white" }],
          });
          optionBasket = [];
          return;
        }
      }
      this.clickOptionPrice = 0;
      this.optionSetPrice = 0;
      this.menuClickPopup = false;
      item.sel_price = totalMenuPrice;
      const addItem = { ...item, menuOptionList: optionBasket };
      const product = this.shoppingBasket.find(
        (item) => item.prod_name === addItem.prod_name
      );

      if (product == null) {
        this.shoppingBasket.push(addItem);
      } else if (
        product != null &&
        product.menuOptionList.length != addItem.menuOptionList.length
      ) {
        this.shoppingBasket.push(addItem);
      } else if (
        product != null &&
        product.menuOptionList.length == addItem.menuOptionList.length
      ) {
        let optionListCount = 0;
        product.menuOptionList.filter((addProduct) => {
          addItem.menuOptionList.forEach((productItem) => {
            if (
              addProduct.setprod_code == productItem.setprod_code &&
              addProduct.set_qty == productItem.set_qty
            ) {
              optionListCount += 1;
            }
          });
        });

        if (optionListCount == product.menuOptionList.length) {
          product.count += addItem.count;
        } else {
          this.shoppingBasket.push(addItem);
        }
      } else {
        product.count += addItem.count;
      }
      //장바구니 수량 표시
      let shoppingBasketCount = 0;
      this.shoppingBasket.forEach(
        (item) => (shoppingBasketCount += item.count)
      );
      EventBus.$emit("getOrderLength", shoppingBasketCount);
    },
    //상품정보팝업닫기
    meunPopUpClose() {
      this.clickOptionPrice = 0;
      this.optionSetPrice = 0;
      this.menuClickPopup = false;
    },
    //장바구니비우기
    removeItems(item) {
      this.shoppingBasket.splice(item);
    },
    //메뉴삭제
    removeOneItem(item) {
      const index = this.shoppingBasket.indexOf(item);
      if (index !== -1) {
        this.shoppingBasket.splice(index, 1);
      }
    },
    //옵션클릭
    optionClick(item, option) {
      if (option.soldout_flag == "1") {
        option.chk_flag = false;
        return;
      }
      if (item.must_flag == 1 && item.opt_cnt == 1) {
        item.optionList.forEach((optionItem) => {
          if (
            optionItem.setprod_code == option.setprod_code &&
            option.chk_flag != false
          ) {
            this.clickOptionPrice += option.set_price;
            option.set_qty += 1;
          } else if (
            optionItem.setprod_code != option.setprod_code &&
            optionItem.chk_flag == true
          ) {
            this.clickOptionPrice -= optionItem.set_price;
            optionItem.set_qty -= 1;
          }
          optionItem.chk_flag = false;
        });
        option.chk_flag = true;
      } else if (item.must_flag == 0 && item.opt_cnt == 1) {
        if (option.chk_flag != false) {
          item.optionList.forEach((optionItem) => {
            if (optionItem.setprod_code == option.setprod_code) {
              this.clickOptionPrice += option.set_price;
              option.set_qty += 1;
            } else if (
              optionItem.setprod_code != option.setprod_code &&
              optionItem.chk_flag == true
            ) {
              this.clickOptionPrice -= optionItem.set_price;
              optionItem.set_qty -= 1;
            }
            optionItem.chk_flag = false;
          });
          option.chk_flag = true;
        } else {
          this.clickOptionPrice -= option.set_price;
          option.set_qty -= 1;
        }
      } else if (item.opt_cnt > 1) {
        let checkedCount = 0;
        let totalQty = 0;
        item.optionList.forEach((optionItem) => {
          if (optionItem.set_qty > 1) {
            totalQty += optionItem.set_qty;
          }
          if (optionItem.chk_flag == true) {
            if (checkedCount + totalQty > item.opt_cnt) {
              option.chk_flag = false;
              return;
            }
            checkedCount += 1;
            if (optionItem.setprod_code == option.setprod_code) {
              this.clickOptionPrice += option.set_price;
              option.set_qty += 1;
            }
          } else {
            if (optionItem.setprod_code == option.setprod_code) {
              this.clickOptionPrice -= option.set_price;
              this.optionSetPrice -= option.set_price * (option.set_qty - 1);
              option.set_qty = 0;
            }
          }
        });
        if (checkedCount > item.opt_cnt) {
          option.chk_flag = false;
          this.clickOptionPrice -= option.set_price;
          option.set_qty -= 1;
          this.$q.notify({
            message:
              "'" +
              item.setgrp_name +
              "' " +
              item.opt_cnt +
              "개 선택가능합니다.",
            color: "indigo-10",
            position: "center",
            icon: "announcement",
            timeout: 500,
            textColor: "white",
            actions: [{ label: "확인", color: "white" }],
          });
        }
      } else if (item.opt_cnt == 0) {
        if (option.chk_flag == true) {
          this.clickOptionPrice += option.set_price;
          option.set_qty += 1;
        } else {
          this.clickOptionPrice -= option.set_price;
          this.optionSetPrice -= option.set_price * (option.set_qty - 1);
          option.set_qty = 0;
        }
      }
      // console.log(item.optionList);
    },
    //옵션수량뺴기
    OnOptionCountRemove(option) {
      if (option.set_qty <= 0 || option.chk_flag == false) {
        return;
      }
      let count = 1;
      option.set_qty -= count;
      this.optionSetPrice -= option.set_price;
    },
    //옵션수량더하기
    OnOptionCountAdd(item, option) {
      let checkCount = 0;
      let totalQty = 0;
      item.optionList.forEach((optionItem) => {
        if (optionItem.set_qty > 1) {
          totalQty += optionItem.set_qty;
        }
        if (optionItem.chk_flag == true) {
          checkCount++;
        }
      });
      if (option.chk_flag == false) {
        return;
      } else if (item.opt_cnt != 0 && checkCount == item.opt_cnt) {
        this.$q.notify({
          message:
            "'" + item.setgrp_name + "' " + item.opt_cnt + "개 선택가능합니다.",
          color: "indigo-10",
          position: "center",
          icon: "announcement",
          timeout: 500,
          textColor: "white",
          actions: [{ label: "확인", color: "white" }],
        });
        return;
      } else if (item.opt_cnt != 0 && checkCount + totalQty > item.opt_cnt) {
        this.$q.notify({
          message:
            "'" + item.setgrp_name + "' " + item.opt_cnt + "개 선택가능합니다.",
          color: "indigo-10",
          position: "center",
          icon: "announcement",
          timeout: 500,
          textColor: "white",
          actions: [{ label: "확인", color: "white" }],
        });
        return;
      }
      let count = 1;
      option.set_qty += count;
      this.optionSetPrice += option.set_price;
    },
    //후불주문하기
    OnReqOrder() {
      if (this.shoppingBasket.length == 0) {
        this.$q.notify({
          message: "주문선택내역이없습니다.",
          color: "indigo-10",
          position: "center",
          icon: "announcement",
          timeout: 500,
          textColor: "white",
          actions: [{ label: "확인", color: "white" }],
        });
        return;
      }
      //장바구니 수량 표시
      let shoppingBasketCount = 0;
      this.shoppingBasket.forEach(
        (item) => (shoppingBasketCount += item.count)
      );
      EventBus.$emit("getOrderLength", shoppingBasketCount);
      this.doubleChkingValue = true;
    },
    //주문확정
    async confirmOrder() {

      // 정부장님 작업 필요 위치
      // 1. 안드로이드로 가야하는 데이터 (웹과 로직이 완벽히 같다면 이렇게만 가면됩니다. 그런데 KICC에서 준 문서들을보면 앱의 경우 파라미터명은 조금씩 다른 듯 합니다.)
      const option = {
        S_RQ01: "D1",                        // D1 신용승인   거래구분자(TRAN_TYPE)
        S_RQ02: this.payPrice,               // 총 결제 금액  TOTAL_AMOUNT
        S_RQ03: "00",                        // 할부          INSTALLMENT
        // S_RQ04: "20",                     // 타이머        앱의 경우 없는건지 안보임
        S_RQ05: "A"                          // 부가세        TAX
      }


      // 2. 안드로이드에서 결제 완료 후 결제정보 받기
      const params = [option]

      extra.callToExternalFunction("paymentCard", params)



      let param = {
        SP: "spj_sal_order",
        job_type: "INS",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
        tbl_code: this.getTableInfo.tbl_code,
        pre_paid_flag: "0",
        pack_flag: "0",
        update_id: "S0000001",
        sal_order: [],
        sal_payment: "NULL",
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
      if (result.SUC != 1) {
        this.$q.notify({
          type: "negative",
          message: "주문내역이 올바르지 않습니다.",
          position: "center",
          timeout: 500,
        });
        return;
      }

      // 영수증
      // let param1 = {
      //   SP: "spj_sch_order",
      //   job_type: "ORDSHT",
      //   cust_code: this.getTabletInfo.cust_code,
      //   tbl_code: this.getTableInfo.tbl_code,
      // };
      // const result1 = await this.$store.dispatch("api/execApi", param1);
      // this.tableData = result1.CONT;
      // console.log("222222222", this.tableData);
      // OrderPrint.PrintReceipt(this.tableData);

      extra.showAlert(this, "주문안내", "주문이완료되었습니다.");
      let arr = [];
      arr.push({ ...this.getTableInfo });
      extra.callToExternalFunction("onOrder", arr);
      this.persistent = false;
      this.doubleChkingValue = false;
      this.shoppingBasket.splice(this.shoppingBasket);
      EventBus.$emit("getOrderLength", 0);
    },
    OnPaymentCardResult(result){
      console.log(result)

      /// 여기서 웹 결제 후 동일한 코드를 작성하면 됨.
    },
    //더담기
    addProductBtn() {
      //장바구니 수량 표시
      let shoppingBasketCount = 0;
      this.shoppingBasket.forEach(
        (item) => (shoppingBasketCount += item.count)
      );
      EventBus.$emit("getOrderLength", shoppingBasketCount);
    },
    //화면타이머
    onClickDisplay() {
      this.$store.dispatch("timer/handleScreenClick", "TABLE");
    },

    // 결제
    // OnReqPayment() {
    //   extra.ShowFullScreenLoading();
    //   extra.callToExternalFunction("reqPayment", this.shoppingBasket);
    //   console.log("222", this.shoppingBasket);
    // },
  },
  computed: {
    totalPay() {
      let totalPay = 0;
      this.shoppingBasket.forEach((item, index, arr) => {
        totalPay += item.sel_price * item.count;
      });
      return totalPay;
    },
    totalCount() {
      let totalCount = 0;
      this.shoppingBasket.forEach((item, index, arr) => {
        totalCount += item.count;
      });
      return totalCount;
    },
    payPrice() {
      let payPrice = 0;
      this.getOrderList.forEach((item) => {
        payPrice += item.amt_tot;
      });
      return payPrice;
    },
    payCount() {
      let payCount = 0;
      this.getOrderList.forEach((item) => {
        payCount += item.qty;
      });
      return payCount;
    },
  },
  filters: {
    money(pay) {
      return pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
  watch: {
    prdgrp_code() {
      this.groupCode = this.prdgrp_code;
      this.getMainData();
    },
  },
};
</script>
<style scoped>
.cardHeader {
  display: flex;
  align-items: flex-end;
  padding: 16px;
}
.menuCard {
  border: 1px solid #ccc;
}
.org_price {
  font-size: 16px;
  color: #aaa;
}
.dis_price > ins {
  font-weight: 500;
  text-decoration: none;
  font-size: 20px;
}
#scrollRow {
  margin: 0px 0px 0px 10px;
}
.colCard {
  padding: 10px 10px 0px 0px;
}
.nameSection {
  padding: 0px 5px;
  height: 120px;
  max-height: 15vh;
  flex-direction: column;
  display: flex;
  justify-content: center;
  /* align-items: center; */
}
.nameSection > .subtitle1 {
  font-size: 1.35rem;
  font-weight: bold;
  line-height: 1.55rem;
  letter-spacing: 0.00937em;
  margin-bottom: 5px;
  text-align: center;
}
.my-table-details {
  width: 380px;
  white-space: normal;
  font-size: 20px;
  font-weight: 600;
}
.menuChip {
  background-color: #294380;
}
#btnAction {
  padding: 0px;
}
.menuCount {
  position: absolute;
  bottom: 1em;
  display: flex;
  align-items: center;
  margin: 0px 60px;
}
.menuPrice {
  position: absolute;
  bottom: 3em;
  left: 4.2em;
}
.rowCount {
  width: 155px;
  font-size: 22px;
}
.optionCount {
  position: absolute;
  right: 8.5em;
  font-size: 22px;
}
.orderTotalBox > div > span,
.cartTotalBox > div > span {
  font-size: 20px;
  font-weight: bold;
}
.cancleBtn {
  width: 180px;
  height: 70px;
  font-size: 1.75rem;
  background-color: #e3e3e3;
  color: #555;
  border-radius: 0.25em;
}
.addCartBtn {
  width: 180px;
  height: 70px;
  font-size: 1.5rem;
  background-color: #294380;
  color: #fff;
  border-radius: 0.25em;
}
.tdTotalPay {
  font-size: 24px;
  font-weight: bold;
}
.cartTotalBox {
  position: absolute;
  display: inline-block;
  width: 100%;
  bottom: 0px;
  background-color: #f6f6f6;
}
.cartSpan {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
.orderSpan {
  display: flex;
  align-items: center;
}
.orderTotalBox {
  position: absolute;
  display: flex;
  bottom: 15px;
  right: 15px;
  width: 48%;
  height: 65px;
  background-color: #f6f6f6;
  justify-content: flex-end;
  border: 1px solid #ccc;
}
.orderTotalBox > div > span > input,
.cartTotalBox > div > span > input {
  font-size: 24px;
  font-weight: bold;
  border: none;
  background-color: #f6f6f6;
}
.orderTotalBox > div > span > input:focus,
.cartTotalBox > div > span > input:focus {
  outline: none;
}
.orderSpan > :first-child {
  margin-right: 3.5em;
}
.orderSpan > :nth-child(2) {
  margin-right: 2em;
}
.totalCount {
  width: 35px;
  text-align: center;
}
.totalPay {
  font-size: 24px;
  font-weight: bold;
  width: 95px;
}
.cartName {
  font-size: 36px;
  font-weight: bold;
}
.removeItemBtn {
  width: 180px;
  height: 55px;
  font-size: 1.25rem;
  border: solid 1px #e0e0e0;
  color: #424242;
  margin-left: 4em;
}
.orderBtnBox {
  position: absolute;
  bottom: 10px;
  right: 20px;
}
.cartBtnBox {
  position: absolute;
  bottom: 0;
  height: 75px;
  width: 100%;
}
.addProductBtn {
  width: 34%;
  /* height: 75px; */
  font-size: 1.95rem;
  background-color: #294380;
  color: #fff;
}
.cartOrderBtn {
  width: 66%;
  /* height: 75px; */
  font-size: 1.95rem;
  background-color: #b5b5b5;
  color: #333;
}
.optionSection {
  padding: 10px;
}

.inputBox {
  display: flex;
  align-items: center;
  height: 55px;
}
.inputBox > .q-checkbox {
  font-size: 20px;
  font-weight: 500;
}
#optionBtn {
  position: absolute;
  right: 2em;
  display: flex;
  align-items: center;
}
.removeOneItem {
  background-color: #294380;
  /* margin-left: 60px; */
}
.optionTd {
  display: flex;
  align-items: flex-end;
  padding-bottom: 2px;
}
.optionCountTd {
  margin-right: 10px;
}
.orderOptionUl,
.optionUl {
  list-style: none;
  display: flex;
  justify-content: flex-start;
  margin: 0px;
  padding: 0px;
  color: #606060;
}
.optionUl > li {
  float: left;
}
.orderOptionUl > li:first-child,
.optionUl > li:first-child {
  width: 180px;
}

.optionUl > li:nth-child(2) {
  width: 15px;
  margin: auto;
}
.orderOptionUl > li:nth-child(2) {
  width: 15px;
}
.optionUl > li:nth-child(3),
.orderOptionUl > li:nth-child(3) {
  width: 55px;
  font-weight: 500;
  text-align: end;
}
.basketScroll::-webkit-scrollbar {
  display: none;
}
.q-table td:nth-child(2) {
  text-align: end;
}
.q-table tr td:nth-child(2) {
  padding: 7px 0px;
}
.resultTable {
  padding: 0px 15px;
}
.rowProdName {
  font-size: 20px;
  font-weight: 600;
  color: #121212;
  letter-spacing: -0.8px;
  width: 35vw;
  white-space: normal;
}
.rowProdPrice {
  font-size: 18px;
  font-weight: 600;
  color: #121212;
  letter-spacing: -0.8px;
}
.rowProdQty {
  font-size: 18px;
  font-weight: 600;
  color: #121212;
  letter-spacing: -0.8px;
  margin-right: auto;
}
.checkOrderList {
  position: absolute;
  background-color: #294380;
  color: #fff;
  border: 1px solid #ccc;
  bottom: 15px;
  left: 15px;
  height: 65px;
  width: 48%;
  font-size: 1.55rem;
}
.salesValues {
  display: flex;
  justify-content: space-around;
}
.alertCheck {
  display: flex;
  background-color: #f6f6f9;
  color: #555;
  align-items: center;
  justify-content: center;
  padding-left: 35px;
  font-size: 1.75rem;
  font-weight: 800;
}

.alertList {
  padding-top: 10px;
  text-align: center;
  font-size: 1.35rem;
  font-weight: bold;
  letter-spacing: 12px;
}
.cardQitem {
  display: flex;
  height: 30px;
  align-items: center;
  border-bottom: solid 1px #ccc;
}
.priceQitem {
  display: flex;
  border-top: solid 1px #ccc;
  align-items: center;
}
.cardQitem > div:first-child {
  display: inline-block;
  width: 310px;
  text-align: center;
}
.cardQitem > div:nth-child(2) {
  display: inline-block;
  width: 60px;
  text-align: center;
}
.cardQitem > div:nth-child(3) {
  display: inline-block;
  width: 150px;
  text-align: center;
}
.menuSection {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.menuSection > span {
  width: 300px;
  max-width: 300px;
}
.menuCountSection {
  display: flex;
  width: 45px;
  justify-content: center;
}

.menuTotalAmt {
  width: 115px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.priceBox {
  display: inline-block;
  width: 150px;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 600;
}
.boxItem {
  display: inline-block;
  position: absolute;
  right: 2em;
  font-size: 1.25rem;
}
.boxItem > span:first-child {
  margin-right: 3em;
}
</style>
