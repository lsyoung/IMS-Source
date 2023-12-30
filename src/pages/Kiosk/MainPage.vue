<template>
  <div class="imgBg">
    <div class="kioskCard">
      <div class="topBar justify-center bg-grey-1 self-start">
        <div class="text-center q-pa-md">
          <q-img src="../../assets/imlogitech_logo.svg" class="mainImg" />
        </div>
      </div>
      <div>
        <div class="storeName">
          {{ storeName1 }}
          <br />
          {{ storeName2 }}
        </div>
      </div>
      <div class="btnCon">
        <div>
          <q-btn label="먹고가기" class="kioskBtn bg-primary text-grey-1 q-mr-sm" @click="onMovePage(0)" />
          <q-btn label="포장하기" class="kioskBtn bg-primary text-grey-1 q-ml-sm" @click="onMovePage(1)" />
        </div>
      </div>
    </div>
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
      storeName1: "한우명가1111",
      storeName2: "한식 점문점",
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

<style scoped>
.imgBg {
  background-image: url(../../assets/index_img.jpg);
  background-position: center center;
  background-repeat: no-repeat;
  background-size: auto 105%;
  height: 100vh;
  width: 100vw;
}
.kioskCard {
  background-color: rgba(0,0,0,.5);
  height: 100vh;
  width: 100vw;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
.mainImg {
  width: 120px;
}
.topBar {
  display: flex;
  width: 100vw;
}
.storeName {
  font-size: 9.2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  width: 85vw;
  justify-content: center;
  align-items: center;
}
.btnCon {
  width: 100%;
  padding: 3rem;
  text-align: center;
}
.kioskBtn {
  padding: 20px;
  width: 48%;
}
</style>
