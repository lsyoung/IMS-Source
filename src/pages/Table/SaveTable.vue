<template>
  <div class="wrap bg-grey-1">
    <div class="topBox bg-grey-1">
      <q-btn class="saveTable" flat @click="saveTable">저장 </q-btn>
      <!-- <q-btn class="selectTable" flat>테이블선택 :</q-btn> -->
      <span class="text-grey-9" v-if="getTableName != ''">{{ getTableName }}</span>
      <span class="text-grey-9" v-else-if="changeTableName != undefined">
        {{ changeTableName }}
      </span>
    </div>
    <q-scroll-area style="height: calc(100vh - 70px); padding: 6px">
      <div class="row q-col-gutter-sm" id="contain">
        <div class="col-2" v-for="table in getTableList" :key="table.tbl_code">
          <q-card
            class="tableCard text-center"
            :class="{ active: changeTableCode == table.tbl_code }"
            :id="table.tbl_code"
            flat
            bordered
            @click="onTableClick(table)"
          >
            <q-card-section class="q-pa-xs tableName vertical-middle" style="height: 100%;">
              <div style="height: 100%; display: flex; justify-content: center; align-items: center;" class="text-h6 text-weight-bold  text-grey-9">
                {{ table.tbl_name }}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-scroll-area>
  </div>
</template>

<script>
export default {
  name: "SaveTable",
  props: {
    tbl_code: {
      type: String,
      default: "",
    },
    tbl_name: {
      type: String,
      default: "",
    },
  },

  mounted() {
    //태블릿정보
    this.getTabletInfo = this.$store.getters["table/tabletInfo"];
    this.getMainData();
    //테이블정보있을때
    this.changeTableName = this.$route.query.tbl_name;
    this.changeTableCode = this.$route.query.tbl_code;
  },
  data() {
    return {
      getTableList: [],
      selectTable: [],
      getTableName: "",
      changeTableCode: "",
      changeTableName: "",
      getTabletInfo: "",
      selectCode: "",
    };
  },
  methods: {
    async getMainData() {
      let param = {
        SP: "spj_mst_table",
        job_type: "SEL",
        cust_code: this.getTabletInfo.cust_code,
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
      this.getTableList = result.CONT;
      this.getTableList.sort((a, b) => {
        const regex = /[^0-9]/g;
        if (
          Number(a.tbl_name.replace(regex, "")) >
          Number(b.tbl_name.replace(regex, ""))
        )
          return 1;
        if (
          Number(a.tbl_name.replace(regex, "")) ===
          Number(b.tbl_name.replace(regex, ""))
        )
          return 0;
        if (
          Number(a.tbl_name.replace(regex, "")) <
          Number(b.tbl_name.replace(regex, ""))
        )
          return -1;
      });
    },
    onTableClick(table) {
      let cardClicked = document.querySelectorAll(".tableCard");
      cardClicked.forEach((card) => {
        if (table.tbl_code === card.id && card.classList.contains("active")) {
          card.classList.remove("active");
          this.changeTableName = "";
          const findIndex = this.selectTable.findIndex(
            (item) => item.tbl_code === this.selectCode
          );
          if (findIndex > -1) {
            this.selectTable.splice(findIndex, 1);
            this.getTableName = "";
            this.selectCode = "";
          }
        } else if (
          table.tbl_code != card.id &&
          card.classList.contains("active")
        ) {
          card.classList.remove("active");
          const findIndex = this.selectTable.findIndex(
            (item) => item.tbl_code === card.id
          );
          if (findIndex > -1) {
            this.selectTable.splice(findIndex, 1);
          }
        } else if (
          table.tbl_code === card.id &&
          !card.classList.contains("active")
        ) {
          card.classList.add("active");
          this.selectTable.push({ ...table });
          this.selectCode = table.tbl_code;
        }
      });
      if (this.selectTable.length != 0) {
        this.getTableName = this.selectTable[0].tbl_name;
      }
    },
    saveTable() {
      if (this.selectTable.length == 0 && this.changeTableCode == undefined) {
        return;
      }

      if (this.selectTable.length == 0 && this.changeTableCode != undefined) {
        this.$store.dispatch("table/setTable", {
          tbl_code: this.changeTableCode,
          tbl_name: this.changeTableName,
        });
        this.$router.push({ path: "/" });
      } else {
        this.$store.dispatch("table/setTable", {
          tbl_code: this.selectTable[0].tbl_code,
          tbl_name: this.selectTable[0].tbl_name,
        });
        this.$router.push({ path: "/" });
      }
    },
  },
};
</script>
<style scoped>
.wrap {
  /* background-color: #f2f6fc; */
}
.topBox {
  display: flex;
  height: 70px;
  align-items: center;
  background-color: #9e9e9e;
  border-bottom: 1px solid #D6D6D6;
}
.topBox > span {
  position: absolute;
  right: 20px;
  color: #fff;
  font-size: 1.35rem;
  font-weight: 600;
}
.tableCard {
  height: 80px;
  border: 1px solid #e4e8ee;
}
.selectTable {
  color: #fff;
  font-size: 1.35rem;
  font-weight: 600;
}
.saveTable {
  position: absolute;
  left: 10px;
  width: 150px;
  background-color: #DE5F50;
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
}
.tableCard.active {
  background-color: #fac1ba;
  border: 1px solid #e4e8ee;
}
</style>
