<template>
  <q-dialog v-model="dialogOpened" persistent>
    <q-card class="alertCard">
      <q-bar class="alertBar">
        <div>{{ dialogTitle }}</div>
      </q-bar>
      <q-card-section class="items-center cardContent">
        {{ dialogMessage }}
      </q-card-section>
      <!-- <q-card-section>
        <div class="text-subtitle1"><span v-html="dialogMessage"></span></div>
      </q-card-section> -->
      <div class="btnDiv">
        <q-btn class="okBtn" flat v-close-popup> 확인 </q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "alert-dialog",
  data() {
    return {
      dialogOpened: false,
      dialogTitle: "",
      dialogMessage: "",
    };
  },
  methods: {
    ShowDialog(title, message) {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogOpened = true;
    },
  },
};
</script>
<style scoped>
.alertCard {
  width: 500px;
  max-width: 500px;
}
.alertBar {
  background-color: #294380;
  color: #fff;
}
.btnDiv {
  display: flex;
  padding: 0 15px 15px;
  justify-content: space-around;
}
.okBtn {
  flex-basis: 40%;
  font-size: 1.35rem;
  background-color: #294380;
  color: #fff;
}
.cardContent {
  text-align: center;
  font-size: 1.65rem;
  font-weight: 600;
  line-height: 2;
}
</style>
