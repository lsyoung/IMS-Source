<template>
  <div class="wrap bg-grey-1">
    <q-scroll-area class="scroll"
             :thumb-style="thumbStyle" style="height: calc(100vh - 116px); padding: 0">
      <div class="row">
        <div class="col-12 q-pa-lg">
          <div class="row" id="scrollRow">
            <div
              class="col-3 q-pa-md justify-center text-center"
              v-for="item in groupMenu"
              :key="item.prod_code"
            >
              <q-card
                class="transparent no-border no-border-radius"
                flat
                :disable="item.soldout_flag == '1'"
                @click="OnMenuClick(item)"
              >
                <q-img class="menu__img no-border" :src="item.prod_image" :ratio="1 / 1">
                  <q-chip
                    square
                    size="md"
                    color="red"
                    text-color="white"
                    label="주문불가"
                    v-if="item.soldout_flag == 1"
                  />
                  <q-chip
                    square
                    color="orange"
                    size="md"
                    text-color="white"
                    label="신상품"
                    icon="fa-solid fa-star"
                    v-if="item.new_flag == 1"
                  />
                  <q-chip
                    square
                    color="secondary"
                    size="md"
                    text-color="white"
                    label="추천"
                    icon="fa-solid fa-thumbs-up"
                    v-if="item.recmd_flag == 1"
                  />
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-1 text-grey-3 text-h5 text-center text-weight-bold">
                      NO IMAGE
                    </div>
                  </template>
                </q-img>
                <q-card-section>
                  <div class="text-h5" style="white-space: no-wrap; overflow: hidden; text-overflow: ellipsis; width: 100%; width: 100%;
  display: block ruby;">
                    {{ item.prod_name }}
                  </div>
                  <div class="text-h6 text-center" style="min-height: 60px; display: flex; justify-content: end; flex-direction: column;">
                    <span class="text-grey-5 text-subtitle2" v-if="item.dc_price != 0">
                      <del>{{ item.price | money }}원 </del>
                    </span>
                    <span class="text-grey-7">
                      {{ item.sel_price | money }}원
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
    <!--  -->
    <q-dialog
      v-model="menuClickPopup"
      persistent
      fullWidth
      fullHeight
      @click="onClickDisplay"
    >
      <q-card style="border-radius: 20px;">
        <q-toolbar-title class="q-py-sm text-h6 text-grey-1 bg-primary text-center">
          상품정보
        </q-toolbar-title>
        <div class="row">
          <div class="col-4 q-pa-lg">
            <q-img :src="clickedItem.prod_image" :ratio="1 / 1">
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-grey-1 text-grey-3 text-h5 text-center text-weight-bold">
                  NO IMAGE
                </div>
              </template>
            </q-img>
            <div class="text-h5 text-grey-9 q-mt-md text-weight-bold">
              {{ clickedItem.prod_name }}
            </div>
            <q-separator class="q-my-sm" />
            <div class="text-body1 text-grey-9 q-my-lg">
              {{ clickedItem.prod_comment }}
            </div>
            <div class="row justify-center items-center q-py-lg">
              <div class="col-6 text-h5">
                {{
                  ((clickedItem.sel_price + clickOptionPrice + optionSetPrice) *
                    clickedItem.count)
                    | money
                }}
                원
              </div>
              <div class="col-6 text-center justify-center items-center" style="border: 2px solid #E2E2E2; border-radius: 10px;">
                <q-btn
                  flat
                  dense
                  size="18px"
                  :ripple="false"
                  icon="remove"
                  style="float: left;"
                  @click="OnMenuCountRemove(clickedItem)"
                />
                <input
                  v-model="clickedItem.count"
                  readonly
                  style="
                    width: 20px;
                    text-align: center;
                    border: none;
                    font-size: 24px;
                    line-height: 37px;
                    
                  "
                />
                <q-btn
                  flat
                  dense
                  size="18px"
                  :ripple="false"
                  icon="add"
                  style="float: right;"
                  @click="OnMenuCountAdd(clickedItem)"
                />
            </div>
            </div>
          </div>
          <q-separator vertical class="q-mr-lg" />
          <div class="col q-pr-md q-pt-md">
            <q-scroll-area
             class="scroll"
             :thumb-style="thumbStyle"
              style="height: calc(73vh); max-height: 73vh"
            >
              <q-card-section
                class="optionSection"
                v-for="item in optionGroup"
                :key="item.setgrp_code"
              >
                <span class="text-h5 text-weight-bold text-grey-9">
                  {{ item.setgrp_name }}
                </span>
                <span
                  class="text-subtitle2 text-weight-bold text-primary"
                  
                  v-if="item.must_flag == '1'"
                >
                  필수선택 {{ item.opt_cnt }}개
                </span>
                <div class="col-12">
                  <div
                    class="inputBox"
                    v-for="optionItem in item.optionList"
                    :key="optionItem.setprod_code"
                  >
                    <q-checkbox
                      size="lg"
                      keep-color
                      color="primary"
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
                    <div class="float-right text-h7 text-right" style="width: 100px; margin-top: 12px;">
                      {{ optionItem.set_price | money }}원
                    </div>
                    <div  class="float-right" style="border: 2px solid #E2E2E2; border-radius: 10px; margin-top: 6px;" id="optionBtn" v-if="optionItem.qty_edit_flag == 1">
                      <q-btn
                        flat
                        dense
                        size="md"
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
                        "
                      />
                      <q-btn
                        flat
                        dense
                        size="md"
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
            <div class="col q-gutter-x-md text-right q-mt-md q-pr-md">
            <q-btn
              unelevated
              size="lg"
              style="width: 250px; border-radius: 10px;"
              color="grey-6"
              label="취소"
              @click="meunPopUpClose"
            />
            <q-btn
              unelevated
              size="lg"
              style="width: 250px; border-radius: 10px;"
              color="primary"
              class="addCartBtn"
              label="장바구니담기"
              @click="OnAppendToBasket(clickedItem, optionGroup)"
            ></q-btn>
          </div>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog
      v-model="persistent"
      persistent
      fullWidth
      full-height
      :position="position"
      
      @click="onClickDisplay"
    >
      <q-card style="border-radius: 20px; width: 100%; border-bottom-left-radius: 0; border-bottom-right-radius: 0;">
        <q-item class="q-py-md">
          <q-item-section>
            <div class="row">
              <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-mr-lg">장바구니</div>
              <q-separator vertical />
              <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-ml-lg">{{ this.getTableInfo.tbl_name }}</div>
            </div>
          </q-item-section>
          <q-item-section class="items-end">
            <q-btn
              class="removeItemBtn"
              rounded
              color="grey-5"
              unelevated
              icon="refresh"
              style="width:12vw;"
              label="장바구니비우기"
              @click="removeItems(shoppingBasket)"
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <div class="row">
          <div class="col-8">
            <q-card-section>
              <q-scroll-area
              class="scroll"
             :thumb-style="thumbStyle"
              style="height: calc(65vh); max-height: 65vh"
              >
                <q-table
                  :data="shoppingBasket"
                  :columns="shoppingBasketColumns"
                  :pagination.sync="pagination"
                  hide-header
                  hide-bottom
                  flat
                  virtual-scroll
                >
                  <template v-slot:body="dataRow">
                    <q-tr :props="dataRow" no-hover style="vertical-align: top;">
                      <!--  -->
                      <q-td style="width: 100px; padding: 0; padding-top: 20px; padding-bottom: 10px;">
                          <q-img :src="dataRow.row.prod_image" :ratio="1 / 1" style="width: 100%; border-radius: 10px;">
                            <template v-slot:error>
                              <div class="no-pointer-events absolute-full flex flex-center bg-grey-1 text-grey-3 text-h7 text-center text-weight-bold">
                                NO IMAGE
                              </div>
                            </template>
                          </q-img>
                      </q-td>
                      <q-td style="padding-top: 20px;">
                        <div class="text-h6 text-grey-9 no-pointer-events">{{ dataRow.row.prod_name }}</div>
                        <div class="q-mt-lg no-pointer-events">
                          <ul
                            v-for="item in dataRow.row.menuOptionList"
                            v-bind:key="item.setprod_code"
                            style="list-style: none; margin: 0; padding: 0; display: flex; gap: 10px; justify-content: stretch; width: 100%; flex-wrap: nowrap;">
                            <li class="col text-grey-9">{{ item.setprod_name }}</li>
                            <li class="col text-grey-9 text-right">{{ item.set_qty }}</li>
                            <li class="col text-grey-9 text-right">{{ item.set_price | money }}원</li>
                          </ul>
                        </div>
                      </q-td>
                      <q-td style="padding-top: 20px; text-align: right;">
                        <span class="text-h6 q-ml-md no-pointer-events">
                            {{ (dataRow.row.sel_price * dataRow.row.count) | money }}
                            원
                        </span>
                        <div class="q-mt-lg" style="border: 1px solid #E2E2E2; border-radius: 10px; width: 50%; position: absolute; right: 10px; display: flex; justify-content: stretch;">
                            <q-btn
                              class="col float-left"
                              flat
                              dense
                              size="sm"
                              :ripple="false"
                              icon="remove"
                              @click="OnMenuCountRemove(dataRow.row)"
                            />
                            <input
                              class="col"
                              v-model="dataRow.row.count"
                              readonly
                              style="
                                width: 50px;
                                text-align: center;
                                border: none;
                                font-size: 16px;
                              "
                            />
                            <q-btn
                              class="col float-right"
                              outline
                              flat
                              dense
                              size="sm"
                              :ripple="false"
                              icon="add"
                              @click="OnMenuCountAdd(dataRow.row)"
                            />
                          </div>
                      </q-td>
                      <q-td key="countPay" :props="dataRow" style="vertical-align:bottom; padding-bottom: 25px;">
                          <q-btn
                            class="removeOneItem"
                            unelevated
                            round
                            color="grey-5"
                            size="sm"
                            text-color="white"
                            icon="fas fa-xmark"
                            @click="removeOneItem(dataRow.row)"
                          />
                      </q-td>
                      <!--  -->
                    </q-tr>
                  </template>
                </q-table>
                </q-scroll-area>
              </q-card-section>
          </div>
          <q-separator vertical />
          <div class="col">
            <div class="row" style="height: 100%">
              <div class="">
                <div class="q-my-xl text-h5 row q-pb-lg"  style="border-bottom: 1px solid #E2E2E2;">
                  <div class="col text-grey-7 text-weight-medium no-pointer-events q-pl-lg">주문수량</div>
                  <div class="col text-weight-medium no-pointer-events"><input class="totalCount" v-model="totalCount" readonly style="border: none; text-align: right; width: 100%;" /></div>
                  <div class="col-auto q-pr-lg text-weight-medium no-pointer-events">개</div>
                  
                </div>
                <div class="q-my-xl text-h5 row q-pb-lg" style="border-bottom: 1px solid #E2E2E2;">
                  <div class="col text-grey-7 text-weight-medium no-pointer-events q-pl-lg">합계</div>
                  <div class="col text-weight-medium no-pointer-events"><input
                    type="text"
                    :value="totalPay | money"
                    readonly
                    style="border: none; text-align: right; width: 100%;"
                  /></div>
                  <div class="col-auto q-pr-lg text-weight-medium no-pointer-events">원</div>
                </div>
              </div>
              <div class="self-end q-mb-lg row q-px-lg" style="width: 100%; gap: 20px; height: 7vh;">
                <q-btn
                unelevated
                color="grey-5"
                class="col text-h6"
                icon="add_circle"
                  label="더담기"
                  @click="addProductBtn"
                  v-close-popup
                />
                <q-btn
                unelevated
                color="primary text-h6"
                class="col"
                icon="shopping_basket"
                  label="주문하기"
                  @click="OnReqOrder"
                ></q-btn>
              </div>
            </div>
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
      <q-card style="border-radius: 20px; width: 100%;">
        <q-card-section>
          <q-item class="q-py-md">
            <q-item-section>
              <div class="row">
                <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-mr-lg">주문서</div>
                <q-separator vertical />
                <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-ml-lg">{{ this.getTableInfo.tbl_name }}</div>
              </div>
            </q-item-section>
            <q-item-section class="items-end">
              <q-btn
                class="removeItemBtn"
                rounded
                color="grey-5"
                unelevated
                icon="cancel"
                style="width:12vw;"
                label="취소"
                v-close-popup
              />
            </q-item-section>
          </q-item>
          <q-separator /> 
          <div class="row">
            <div style="width: 100%;">
              <q-card class="bg-orange-2 q-ma-lg col text-deep-orange-10 text-h5" flat bordered>
                <q-card-section horizontal>
                  <q-card-section class="col text-center text-weight-bold">
                    주문서 확인 후 주문확정해주세요.
                  </q-card-section>
                </q-card-section>
              </q-card>
            </div>
            <!--  -->
            <q-item class="row text-h6 text-grey-7" style="width: 100%;">
              <div class="col">
                <span> 메뉴 </span>
              </div>
              <div class="col text-center">
                <span> 수량 </span>
              </div>
              <div class="col text-right q-pr-lg">
                <span> 가격 </span>
              </div>
            </q-item>
            <div style="width: 100%;" class="q-px-lg">
              <q-scroll-area class="scroll"
             :thumb-style="thumbStyle" style="height: calc(40vh); max-height: 100%">
                <!--  -->
                  <q-card-section
                    v-for="(menu, index) in shoppingBasket"
                    :key="index"
                  >
                    <div class="row">
                      <div class="col">
                        <div class="row" style="gap: 10px;">
                          <div class="col-3">
                            <q-img :src="menu.prod_image" :ratio="1 / 1" style="width: 100%; border-radius: 10px;">
                              <template v-slot:error>
                                <div class="no-pointer-events absolute-full flex flex-center bg-grey-1 text-grey-3 text-h7 text-center text-weight-bold">
                                  NO IMAGE
                                </div>
                              </template>
                            </q-img>
                          </div>
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
                      <div class="col text-h6 text-center q-pr-lg text-grey-9">
                        {{ menu.count }}
                      </div>
                      <div class="col text-h6 text-right text-grey-9">
                        {{ (menu.sel_price * menu.count) | money }} 원
                      </div>
                    </div>
                    <q-separator class="q-mt-md " />
                  </q-card-section>
                <!--  -->
              </q-scroll-area>
            </div>
            <div class="row text-h5 q-px-lg q-py-lg" style="width: 100%;">
              <div class="col">합계</div>
              <div class="col text-center q-pl-md">{{ totalCount }}</div>
              <div class="col text-right q-pr-sm">{{ totalPay | money }}</div>
              <div class="col-auto q-pr-sm">원</div>
            </div>
            <!--  -->
            <div class="row items-center q-px-lg text-h5 text-weight-medium text-grey-9 self-end" style="width: 100%;">
              
              <div class="col">
                <q-btn
                  class="addCartBtn q-py-sm"
                  label="주문확정"
                  unelevated
                  color="primary"
                  size="lg"
                  style="width: 100%;"
                  icon="shopping_basket"
                  @click="confirmOrder"
                />
              </div>
            </div>
            </div>
          </q-card-section>
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
      <q-card style="border-radius: 20px;">
        <q-item class="q-py-md">
          <q-item-section>
            <div class="row">
              <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-mr-lg">주문내역</div>
              <q-separator vertical />
              <div class="q-ml-md text-h5 text-weight-medium text-grey-9 col-auto q-ml-lg">{{ this.getTableInfo.tbl_name }}</div>
            </div>
          </q-item-section>
          <q-item-section class="items-end">
            <q-btn
              class="removeItemBtn"
              rounded
              color="grey-5"
              unelevated
              icon="cancel"
              style="width:12vw;"
              label="확인"
              v-close-popup
            />
          </q-item-section>
        </q-item>
        <q-separator />
        <!-- <q-toolbar-title
          style="text-align: center; background-color: #F96B5A; color: #fff"
          class="q-py-sm text-weight-bold"
        >
          주문내역
        </q-toolbar-title> -->
        <q-card-section>
          <q-scroll-area class="scroll"
             :thumb-style="thumbStyle" style="height: calc(75vh); max-height: 100%">
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
                    <div class="row">
                      <div class="col text-body1">
                        {{ props.row.prod_name }}
                      </div>
                      <div class="col">
                        <ul
                          v-if="props.row.prod_set[0].prod_code != undefined"
                          v-for="subOption in props.row.prod_set"
                          :key="subOption.prod_code"
                          style="list-style: none; margin: 0; padding: 0; display: flex;  justify-content: center; align-items: stretch;"
                        >
                          <li class="col">{{ subOption.prod_name }}</li>
                          <li class="col text-center">{{ subOption.qty }}</li>
                          <li class="col text-right">{{ subOption.price | money }}원</li>
                        </ul>
                      </div>
                      <div class="col text-center q-pr-lg">{{ props.row.qty }} 개</div>
                      <div class="col-2 text-right">
                        {{ props.row.amt_tot | money }} 원
                      </div>
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-scroll-area>
          <div class="row text-h5 text-grey-9">
            <div class="col q-pl-md">
              주문 수량
            </div>
            <div class="col">
              <input v-model="payCount" readonly style="border: 0; width: 80%; text-align: right;" /> 개
            </div>
            <div class="col-1 text-right">
              합계
            </div>
            <div class="col-2 text-right q-pr-sm">
              {{ payPrice | money }} 원
            </div>
          </div>
        </q-card-section>
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

    EventBus.$on("showBasketList", (data) => {
      this.fixed = data.fixed;
      this.OnReqOrder()
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
    EventBus.$off("showBasketList");
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
      position: "bottom",
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
      
      thumbStyle: {
        right: '2px',
        borderRadius: '5px',
        backgroundColor: '#9e9e9e',
        width: '7px',
        opacity: 0.75
      },
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
            color: "primary",
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
          color: "primary",
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
          color: "primary",
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
          color: "primary",
          position: "center",
          icon: "announcement",
          timeout: 1000,
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

      extra.showAlert(this, "주문안내", "fa-regular fa-circle-check", "주문이완료되었습니다.");
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
.menu__img {
  border-radius: 10px !important;
}
.menu__img .q-chip {
  right: 0;
  padding: 8px;
  font-weight: 700;
}
</style>
