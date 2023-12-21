<template>
  <q-dialog v-model="dialogOpened">
    <q-card style="width: 500px">
      <q-card-section
        class="bg-primary text-white"
        v-if="this.dialogType === 'ok'"
      >
        <div class="text-h6">{{ dialogTitle }}</div>
      </q-card-section>
      <q-card-section
        class="bg-negative text-white"
        v-if="this.dialogType === 'error'"
      >
        <div class="text-h6">{{ dialogTitle }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <div class="text-subtitle1"><span v-html="dialogMessage"></span></div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="right" v-if="this.dialogCallback === null">
        <q-btn flat label="OK" class="bg-secondary text-white" v-close-popup />
      </q-card-actions>
      <q-card-actions align="right" v-else>
        <q-btn
          flat
          label="OK"
          class="bg-secondary text-white"
          v-close-popup
          @click="OnOkBtnClick"
        />
        <q-btn
          flat
          label="Cancel"
          class="bg-secondary text-white"
          v-close-popup
          @click="OnOnCancelBtnClick"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "text-dialog",
  data() {
    return {
      dialogOpened: false,
      dialogType: "ok",
      dialogTitle: "",
      dialogMessage: "",
      dialogCallback: null,
      dialogParam: null,
    };
  },
  methods: {
    ShowDialog(type, title, message, callback) {
      this.dialogType = type;
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogCallback = callback;
      this.dialogOpened = true;
    },
    OnOkBtnClick() {
      this.$emit("closeButtonClick");
      this.dialogCallback();
      this.dialogOpened = false;
    },
    OnOnCancelBtnClick() {
      this.$emit("closeButtonClick");
      this.dialogOpened = false;
    },
  },
};
</script>
