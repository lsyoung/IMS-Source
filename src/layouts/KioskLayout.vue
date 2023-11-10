<template>
  <q-layout view="lHh Lpr lFf" @click="onClickDisplay">
    <q-header id="head">
      <q-icon class="homeBtn" name="home" @click="homeClick" />
      <span id="title">Kiosk</span>
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
      remainingTime: 5,
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
      this.remainingTime = 40; // 타이머 초기화
      this.backTimer(); // 타이머 다시 시작
    },
  },
};
</script>
<style scoped>
.homeBtn {
  height: 100px;
  width: 100px;
  font-size: 350%;
  color: #ffffff;
}
#head {
  background-color: #00216a;
  display: flex;
  align-items: center;
}
#title {
  font-size: 45px;
  color: #ffffff;
}
</style>
