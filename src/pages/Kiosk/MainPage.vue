<template>
  <div>
    <q-card style="height: 100vh">
      <q-card-section class="row mainHeader">
        <div class="col">
          <h5 style="font-size: 30px">{{ storeName }}</h5>
        </div>
      </q-card-section>
      <q-img src="https://picsum.photos/780/300" class="mainImg" />
      <q-card-section align="center">
        <div class="btnMain">
          <q-btn label="먹고가기" class="eatTogo" @click="onMovePage(0)" />
          &nbsp;
          <q-btn label="포장하기" class="eatTogo" @click="onMovePage(1)" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  mounted() {
    this.$store.dispatch("api/packFlag", null);
  },
  data() {
    return {
      storeName: "맥도날드 뉴진스 에디션",
    };
  },
  methods: {
    onMovePage(packFlag) {
      //포장 or 매장 선택flag 저장
      this.$store.dispatch("api/packFlag", packFlag);
      this.$router.push("/menuPage");
    },
  },
};
</script>

<style>
.mainHeader {
  text-align: center;
  padding: 3%;
}
.mainImg {
  height: 73%;
}
.btnMain {
  padding-top: 7%;
  padding-bottom: 5%;
}
.eatTogo {
  border-radius: 3%;
  background-color: #00216a;
  color: white;
  font-size: 35px;
  width: 47%;
  height: 150px;
}
</style>
