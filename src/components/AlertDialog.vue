<template>
  <q-dialog v-model="dialogOpened" persistent>
    <q-card class="alertCard" style="border-radius: 20px;">
      <!-- <q-bar class="alertBar">
        <div>{{ dialogTitle }}</div>
      </q-bar> -->
      <q-card-section class="items-center cardContent column q-pt-xl" style="height: 100%;">
        <div class="col text-center" style="width: 100%;">
          <q-icon :name=dialogIcon color="green-6" size="3em" />
        </div>
        <!-- {{ dialogIcon }} -->
        <div class="col text-center">
          {{ dialogMessage }}
        </div>
        <div class="btnDiv self-end q-mb-md">
          <q-btn class="okBtn" flat v-close-popup> 확인 </q-btn>
        </div>
      </q-card-section>
      <!-- <q-card-section>
        <div class="text-subtitle1"><span v-html="dialogMessage"></span></div>
      </q-card-section> -->
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
      dialogIcon: "",
      dialogMessage: "",
    };
  },
  methods: {
    ShowDialog(title, icon, message) {
      this.dialogTitle = title;
      this.dialogIcon = icon;
      this.dialogMessage = message;
      this.dialogOpened = true;
    },
  },
};
</script>
<style scoped>
.alertCard {
  width: 50vw;
  height: 50vh;
  max-width: 50vw;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
}
.alertBar {
  background-color: #F96B5A;
  color: #fff;
}
.btnDiv {
  display: flex;
  justify-content: center;
  width: 100%;
}
.okBtn {
  flex-basis: 40%;
  font-size: 1.35rem;
  background-color: #F96B5A;
  color: #fff;
}
.cardContent {
  display: flex;
  justify-content: center;
  text-align: center;
  font-size: 1.65rem;
  font-weight: 600;
  line-height: 2;
}
</style>
