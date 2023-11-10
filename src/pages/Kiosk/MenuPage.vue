<template>
  <div>
    <div>
      <q-tabs
        v-model="clickMenu"
        active-class="my-menu-link"
        style="margin: 15px 5px 0px"
        inline-label
        outside-arrows
        mobile-arrows
      >
        <q-tab
          v-for="list in groupMenu"
          :key="list.prdgrp_code"
          :name="list.prdgrp_code"
          :label="list.prdgrp_name"
          style="
            border: 1px solid #d3d5d7;
            min-width: 253px;
            min-height: 100px;
            padding: 10px;
          "
          @click="onMenuClicked(list.prdgrp_code)"
        />
      </q-tabs>
      <q-scroll-area style="height: calc(100vh - 900px)">
        <q-tab-panels v-model="clickMenu" animated>
          <q-tab-panel
            v-for="list in groupMenu"
            :key="list.prdgrp_code"
            :name="list.prdgrp_code"
            style="padding: 0px 25px 0px 40px"
          >
            <div class="row">
              <div
                class="col-4 menuCardCol"
                v-for="item in menuList"
                :key="item.prod_code"
              >
                <q-card
                  class="menuCard"
                  @click="item.soldout_flag !== '1' && OnMenuClick(item)"
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
                    <div class="subtitle1" style="font-size: 20px">
                      {{ item.prod_name }}
                    </div>
                    <div
                      class="text-subtitle2"
                      style="text-align: center; font-size: 20px"
                    >
                      <span class="org_price" v-if="item.dc_price != 0">
                        <del>{{ item.price | currency }}원</del>
                      </span>
                      <span class="dis_price">
                        <ins>{{ item.sel_price | currency }}원</ins>
                      </span>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-scroll-area>
    </div>
    <!--장바구니 시작-->
    <div>
      <div class="cart">
        <q-btn
          label="전체취소"
          @click="removeItems(shoppingBasket)"
          class="trashIcon"
        />
        <div style="display: inline-block; font-size: 1.55rem; width: 500px">
          <span style="padding-right: 55px"> 수량 : {{ totalCount }} 개 </span>
          <span> 합계 : {{ totalPay | currency }} 원 </span>
        </div>
        <q-btn push class="btnPay" @click="payBtn">
          <span class="text-center">결제하기</span>
          <div
            v-if="remainingTime > 0"
            class="text-caption"
            style="font-size: 20px"
          >
            ({{ remainingTime }}초)
          </div>
        </q-btn>
      </div>
      <q-card>
        <q-card-section
          class="scroll q-pt-none basketScroll"
          style="max-height: 50vh; height: 585px"
        >
          <q-table
            :data="shoppingBasket"
            :pagination.sync="pagination"
            hide-bottom
            hide-header
            flat
            virtual-scroll
          >
            <template v-slot:body="dataRow">
              <q-tr :props="dataRow">
                <q-td
                  style="font-size: 23px; margin-top: 10px; min-width: 630px"
                >
                  <div class="my-table-details q-mt-sm">
                    {{ dataRow.row.prod_name }}<br />
                  </div>
                  <div
                    style="display: flex; color: #606060; font-size: 0.95rem"
                  >
                    <div
                      v-for="item in dataRow.row.menuOptionList"
                      v-bind:key="item.setprod_code"
                    >
                      <span> {{ item.setprod_name }}&nbsp;*</span>
                      <span> {{ item.set_qty }} &nbsp;</span>
                    </div>
                  </div>
                </q-td>
                <q-td>
                  <div style="display: flex; align-items: center">
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
                        font-size: 25px;
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
                </q-td>
                <q-td style="width: 200px">
                  <div
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: flex-end;
                    "
                  >
                    <div class="tdTotalPay">
                      {{
                        (dataRow.row.sel_price * dataRow.row.count) | currency
                      }}
                      원
                    </div>
                    <div class="removeTd">
                      <q-btn
                        class="removeOneItem"
                        round
                        size="md"
                        text-color="white"
                        icon="fas fa-xmark"
                        @click="removeOneItem(dataRow.row)"
                      />
                    </div>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
    <!--장바구니 끝-->

    <!--모달창 시작-->
    <q-dialog
      v-model="menuClickPopup"
      persistent
      :maximized="maximizedToggle"
      @click="onClickDisplay"
    >
      <q-card>
        <q-toolbar-title
          style="
            text-align: center;
            background-color: #00216a;
            color: #fff;
            font-size: 30px;
          "
        >
          상품정보
        </q-toolbar-title>
        <q-card-section>
          <div class="row" style="padding: 25px">
            <div class="col-4">
              <q-img :src="clickedItem.prod_image" style="height: 300px" />
            </div>
            <div class="col-8" style="padding: 55px 25px 25px">
              <div class="menuName">
                {{ clickedItem.prod_name }}
              </div>
              <div class="text-body1 menuComment">
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
            </div>
          </div>
        </q-card-section>
        <q-scroll-area
          style="height: calc(100vh - 1000px); margin: 15px 0px 0px 35px"
        >
          <q-card-section
            class="items-center chkBox"
            v-for="item in optionGroup"
            :key="item.setgrp_code"
          >
            <span class="text-h4 text-weight-bold">
              {{ item.setgrp_name }}
            </span>
            <span
              class="text-h6 text-weight-bolder"
              style="color: #ff5350"
              v-if="item.must_flag == '1'"
            >
              필수선택 {{ item.opt_cnt }}개
            </span>
            <div class="q-pa-md chkItem">
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
                  {{ optionItem.set_price | currency }}원
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
          </q-card-section>
        </q-scroll-area>
        <div class="text-h5 text-center text-weight-bold opn">
          총 금액 :
          {{
            ((clickedItem.sel_price + clickOptionPrice + optionSetPrice) *
              clickedItem.count)
              | currency
          }}
          원
        </div>
        <div class="actionBox">
          <q-btn
            class="ationAddBtn"
            label="주문담기"
            flat
            @click="OnAppendToBasket(clickedItem, optionGroup)"
          />
          <q-btn
            class="ationCancleBtn"
            label="취소"
            flat
            @click="meunPopUpClose"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EventBus from "../../utils/eventbus";
export default {
  name: "MenuPage",
  data() {
    return {
      menuClickPopup: false,
      maximizedToggle: true,
      groupMenu: [],
      shoppingBasket: [],
      menuList: [],
      optionGroup: [],
      optionList: [],
      menuOptionList: [],
      clickMenu: "",
      clickOptionPrice: 0,
      optionCount: 0,
      optionSetPrice: 0,
      position: "right",
      getTabletInfo: "",
      clickedItem: {
        count: 1,
      },
      remainingTime: 0,
      pagination: {
        rowsPerPage: 0,
      },
    };
  },
  mounted() {
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    this.getMainData();
    //시간
    EventBus.$on("changeTime", (data) => {
      this.remainingTime = data;
    });
  },
  beforeDestroy() {
    EventBus.$off("changeTime");
  },
  methods: {
    async getMainData() {
      let param = {
        SP: "spj_mst_prod_grp",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
      };
      const promise = await this.$store.dispatch("api/execApi", param);
      this.groupMenu = promise.CONT;

      if (this.groupMenu.length > 0) {
        this.clickMenu = this.groupMenu[0].prdgrp_code;
        this.onMenuClicked(this.clickMenu);
      }
    },
    async onMenuClicked(code) {
      this.clickMenu = code;

      let param = {
        SP: "spj_mst_prod_grp_prod",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
        pos_code: this.getTabletInfo.pos_code,
        prdgrp_code: code,
      };
      const result = await this.$store.dispatch("api/execApi", param);
      this.menuList = result.CONT;
    },

    //주문
    async OnMenuClick(item) {
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

    //옵션클릭
    optionClick(item, option) {
      if (option.soldout_flag == "1") {
        option.chk_flag = false;
        return;
      }
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
              "'" + item.setgrp_name + "'" + item.opt_cnt + "개 선택하세요.",
            color: "white",
            position: "center",
            icon: "announcement",
            timeout: 1000,
            closeBtn: "확인",
            textColor: "blue-10",
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

    // 장바구니 담기
    OnAppendToBasket(item, optionGroup) {
      this.onClickDisplay();
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
              "'" +
              optionItem.opt_cnt +
              "개 선택하세요.",
            color: "white",
            position: "center",
            icon: "announcement",
            timeout: 1000,
            closeBtn: "확인",
            textColor: "blue-10",
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
    },

    //수량빼기
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

    //옵션수량뺴기
    OnOptionCountRemove(option) {
      if (option.set_qty <= 0 || option.chk_flag == false) {
        return;
      }
      let count = -1;
      option.set_qty += count;
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
        return;
      } else if (item.opt_cnt != 0 && checkCount + totalQty > item.opt_cnt) {
        return;
      }
      let count = 1;
      option.set_qty += count;
      this.optionSetPrice += option.set_price;
    },
    //상품정보팝업닫기
    meunPopUpClose() {
      this.onClickDisplay();
      this.clickOptionPrice = 0;
      this.optionSetPrice = 0;
      this.menuClickPopup = false;
    },

    removeOneItem(item) {
      const index = this.shoppingBasket.indexOf(item);
      if (index !== -1) {
        this.shoppingBasket.splice(index, 1);
      }
    },

    removeItems(item) {
      this.shoppingBasket.splice(item);
    },

    payBtn() {
      if (this.shoppingBasket.length == 0) {
        this.$q.notify({
          message: "주문내역이 없습니다.",
          color: "white",
          position: "center",
          icon: "announcement",
          timeout: 1000,
          closeBtn: "확인",
          textColor: "blue-10",
        });
        return;
      }

      this.$router.push({
        name: "PayPage",
        params: {
          totalPay: this.totalPay,
          shoppingBasket: this.shoppingBasket,
        },
      });
    },
    //화면타이머
    onClickDisplay() {
      this.$store.dispatch("timer/handleScreenClick", "KIOSK");
      EventBus.$emit("popUpTimer", this.remainingTime);
    },
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
  },
  filters: {
    currency(pay) {
      return pay.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>

<style>
.groupTab {
  height: 90px;
  width: 200px;
  border: 1px solid #222;
}
.q-tab__indicator {
  background-color: transparent;
}
.menuCard {
  margin: 0px 15px 15px 0px;
  border: 1px solid #ccc;
}

.box:nth-child(7n) {
  background: red;
}
.ationAddBtn {
  background-color: #00216a;
  color: white;
  height: 180px;
  width: 450px;
  font-size: 2.55rem;
  border-radius: 0.25em;
  margin-right: 20px;
}
.ationCancleBtn {
  background-color: #e3e3e3;
  color: #555;
  height: 180px;
  width: 450px;
  font-size: 2.55rem;
  border-radius: 0.25em;
}

.opn {
  text-align: center;
  font-size: 30px;
  padding: 30px;
  background-color: #00216a;
  color: #ffffff;
}
.cart {
  height: 100px;
  padding: 15px 40px;
  color: #ffffff;
  background-color: #00216a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cartItem {
  box-shadow: none;
}
.cartMenu {
  padding: 5%;
  margin-bottom: 5%;
}
.btnYn {
  padding-top: 17%;
}
.btnPay {
  height: 70px;
  width: 210px;
  background-color: red;
  color: #fff;
  font-size: 1.55rem;
  font-weight: bold;
  border-radius: 0.25em;
}
.cartCount {
  padding-left: 7%;
  line-height: 300%;
}
.chkItem {
  font-size: 40px;
  background-color: #ffffff;
}
.inputBox {
  display: flex;
  align-items: center;
  height: 55px;
}
.chkBox {
  padding-top: 0%;
}
.trashIcon {
  width: 150px;
  height: 70px;
  background-color: #b5b5b5;
  color: #333;
  font-size: 1.55rem;
  font-weight: 600;
  border-radius: 0.25em;
}
.q-field--dense .q-field__control,
.q-field--dense .q-field__marginal {
  height: 100%;
}
.q-field--outlined .q-field__control {
  height: 45px;
  padding-top: 5px;
  padding-right: 0px;
  margin-left: 2px;
  margin: 0px;
}
.nameSection {
  padding: 0px 5px;
  height: 75px;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}
.nameSection > .subtitle1 {
  font-size: 1rem;
  font-weight: bold;
  line-height: 1.25rem;
  letter-spacing: 0.00937em;
  text-align: center;
}
.q-scrollarea__content {
  min-height: 50px;
  min-width: 100%;
}
.q-tab__label {
  font-size: 25px;
  font-weight: bold;
}
.menuChip {
  background-color: #294380 !important;
}
#optionBtn {
  position: absolute;
  right: 2em;
  display: flex;
  align-items: center;
}
.menuCount {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
.org_price {
  font-size: 14px;
  color: #aaa;
}
.dis_price > ins {
  font-weight: 500;
  text-decoration: none;
  font-size: 16px;
}
.my-menu-link {
  color: white;
  background: #00216a;
  border: 1px solid #00216a !important;
}

.removeOneItem {
  background-color: #00216a;
}
.optionCount {
  position: absolute;
  right: 9em;
  font-size: 30px;
}
.tdTotalPay {
  margin-right: 10px;
  font-size: 24px;
  font-weight: bold;
}
.my-table-details {
  font-size: 1.55rem;
  font-weight: 600;
}
.menuName {
  font-size: 2.35rem;
  font-weight: 600;
  text-align: center;
}
.menuComment {
  width: 550px;
  color: #616161;
  padding-left: 70px;
  margin-top: 20px;
  text-align: center;
}

.actionBox {
  display: flex;
  height: 435px;
  justify-content: center;
  align-items: center;
}
.basketScroll::-webkit-scrollbar {
  display: none;
}
</style>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: 520px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #CEE3F6

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
