<template>
  <div class="q-pa-md save">
    <q-form class="q-gutter-md" @reset="onReset">
      <q-input
        filled
        v-model="cust_code"
        label="매장코드"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || '매장코드를 입력해주세요']"
      />

      <q-input
        filled
        v-model="pos_code"
        label="결제기코드"
        lazy-rules
        :rules="[
          (val) => (val !== null && val !== '') || '결제기코드를 입력해주세요',
        ]"
      />
      <div>
        <q-btn label="저장" class="saveBtn" @click="onSave" />
        <q-btn label="취소" type="reset" class="resetBtn" />
      </div>
    </q-form>
  </div>
</template>

<script>
import extra from "src/utils/extra";

export default {
  name: "table-load",
  data() {
    return {
      tableData: [],
      cust_code: "",
      pos_code: "",
    };
  },
  mounted() {
    this.$store.dispatch("table/setTablet", {
      pos_code: "PS23090028",
      cust_code: "S0000001",
    });
    this.$router.push("/");
    // window.addEventListener("message", async (e) => {
    //   const callInofs = e.data;
    //   if (callInofs.type !== "callFromJsToVue") {
    //     console.log(callInofs.params);
    //     return;
    //   }
    //   if (callInofs.funcName === "tableResult") {
    //     let param = {
    //       SP: "spj_login_pos",
    //       job_type: "USECHK",
    //       cust_code: e.data.params.respData.custCD,
    //       pos_code: e.data.params.respData.posCD,
    //       mj_postype: "TABLE",
    //       mac_addr: e.data.params.respData.macAddr,
    //     };

    //     const result = await this.$store.dispatch("api/execApi", param);
    //     this.tableData = result.CONT;
    //     if (result.SUC == "0") {
    //       let arr = [];
    //       arr.push({ ...result });
    //       extra.callToExternalFunction("powerOff", arr);
    //     } else {
    //       this.$store.dispatch("table/setTablet", {
    //         pos_code: e.data.params.respData.posCD,
    //         cust_code: e.data.params.respData.custCD,
    //       });
    //       this.$router.push("/");
    //     }
    //   }
    // });
  },

  methods: {
    onSave() {
      // 안드로이드 값 넘기기
      let param = {
        cust_code: this.cust_code,
        pos_code: this.pos_code,
      };
      this.tableData.push({ ...param });
      extra.callToExternalFunction("data", this.tableData);
    },
    onReset() {
      this.cust_code = null;
      this.pos_code = null;
    },
  },
};
</script>

<style scoped>
.save {
  max-width: 400px;
  border: 1px solid #bdbbbbc9;
  border-radius: 3%;
  position: relative;
  left: 35%;
  margin-top: 13%;
}
.saveBtn {
  background-color: #00216a;
  color: #fff;
  width: 48%;
  height: 52px;
}
.resetBtn {
  background-color: #00216a;
  color: #fff;
  margin-left: 10px;
  width: 48%;
  height: 52px;
}
</style>
