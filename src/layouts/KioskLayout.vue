<template>
  <q-layout view="lHh Lpr lFf" @click="onClickDisplay">
    <q-header id="head">
      <div class="col text-h5 text-weight-medium">{{ storeName }}</div>
      <div class="col text-center">
        <q-img src="../assets/imlogitech_logo.svg" class="mainImg" />
      </div>
      <div class="col text-right text-h4 justify-end items-center row">
        
        <div
            v-if="remainingTime > 0"
            class="text-weight-medium text-primary q-mr-sm"
            style="font-size: 20px"
          >
            ({{ remainingTime }}초)
        </div>
        <div class="inline">

          <q-icon class="homeBtn" name="home" @click="homeClick" />
        </div>

      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EventBus from "../utils/eventbus";
export default {
  name: "KioskLayout",
  components: {},
  data() {
    return {
      inactivityTimer: null,
      remainingTime: 60,
      storeName: "한우명가 한식 점문점",
    };
  },
  mounted() {
    //타이머
    this.onClickDisplay();
    EventBus.$on("popUpTimer", (data) => {
      clearTimeout(this.inactivityTimer);
      this.resetTimer();
    });
  },
  beforeDestroy() {
    clearTimeout(this.inactivityTimer);
    EventBus.$off("popUpTimer");
  },
  methods: {
    homeClick: function () {
      this.$store.dispatch("timer/changeState");
      this.$router.push("/mainPage");
    },
    //화면타이머
    onClickDisplay() {
      if (this.$router.currentRoute.path == "/payPage") {
        this.$store.dispatch("timer/changeState");
      } else {
        this.$store.dispatch("timer/handleScreenClick", "KIOSK");
        this.resetTimer();
      }
    },
    // 타이머
    backTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      this.inactivityTimer = setTimeout(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--;
          this.backTimer(); // 다음 호출을 예약하여 카운트 다운을 유지
        }
      }, 1000); // 1초마다 체크
      EventBus.$emit("changeTime", this.remainingTime);
      
    },

    resetTimer() {
      if (this.inactivityTimer) {
        clearTimeout(this.inactivityTimer);
      }
      this.remainingTime = 200; // 타이머 초기화
      this.backTimer(); // 타이머 다시 시작
    },
  },
};
</script>
<style scoped>
#head {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #C3C3C3;
  color: #5A5A5A;
  height: calc( 6.25rem);
  padding: 2rem;
  justify-content:space-between;
  flex-direction: row;
  flex-wrap: nowrap;
}
.mainImg {
  width: 100px;
}
</style>
