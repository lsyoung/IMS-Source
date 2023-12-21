import { date, Loading, QSpinnerHourglass } from "quasar";
import EventBus from "src/utils/eventbus";
const spinnerOption = {
  spinner: QSpinnerHourglass,
  delay: 0,
  spinnerColor: "blue",
  spinnerSize: 200,
};

const extra = {
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  dateToStrDay(date) {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }

    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("");
  },
  dateToDivStrDay(date, div) {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }

    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join(div);
  },
  stringToDate(yyyymmddhhmmss, formatString) {
    if (yyyymmddhhmmss == null) {
      return "";
    } else {
      const strDate = String(yyyymmddhhmmss);
      const year = strDate.substring(0, 4);
      const month = strDate.substring(4, 6);
      const day = strDate.substring(6, 8);
      const hour = strDate.substring(8, 10);
      const minute = strDate.substring(10, 12);
      const second = strDate.substring(12, 14);
      const dateTime = new Date(year, month - 1, day, hour, minute, second);
      return date.formatDate(dateTime, formatString);
    }
  },
  stringToDay(yyyymmdd, formatString) {
    if (yyyymmdd == null) {
      return "";
    } else {
      const strDate = String(yyyymmdd);
      const year = strDate.substring(0, 4);
      const month = strDate.substring(4, 6);
      const day = strDate.substring(6, 8);
      const dateTime = new Date(year, month - 1, day);
      return date.formatDate(dateTime, formatString);
    }
  },
  stringHiDateToDate(yyyymmdd) {
    if (yyyymmdd == null) {
      return "";
    } else {
      const strDate = String(yyyymmdd);
      const year = strDate.substring(0, 4);
      const month = strDate.substring(5, 7);
      const day = strDate.substring(8, 10);
      const dateTime = new Date(Number(year), Number(month) - 1, Number(day));
      return dateTime;
    }
  },
  stringYyyyMmDdToDate(strDate) {
    const yyyyMMdd = String(strDate);
    const sYear = yyyyMMdd.substring(0, 4);
    const sMonth = yyyyMMdd.substring(4, 6);
    const sDate = yyyyMMdd.substring(6, 8);
    return new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));
  },
  appendStringDate(nohidate) {
    if (nohidate !== null && nohidate.length === 8) {
      const strDate =
        nohidate.substring(0, 4) +
        "-" +
        nohidate.substring(4, 6) +
        "-" +
        nohidate.substring(6, 8);
      return strDate;
    } else {
      return "";
    }
  },
  showToast(parent, type, message) {
    if (type === "error") {
      parent.$q.notify({
        type: "negative",
        message,
      });
    } else if (type === "ok") {
      parent.$q.notify({
        type: "positive",
        message,
      });
    }
  },
  showPopupTitle(parent, type, title, message) {
    if (
      extra.isNullOrUndefinde(parent) === false &&
      extra.isNullOrUndefinde(parent.$refs) === false
    ) {
      // eslint-disable-next-line no-prototype-builtins
      if (parent.$refs.hasOwnProperty("refAlertPopup") === true) {
        parent.$refs.refAlertPopup.ShowDialog(type, title, message, null);
      } else {
        extra.showToast(
          parent,
          "error",
          "TextTialog 컴포넌트가 추가되어 있지 않습니다."
        );
      }
    }
  },
  showPopup(parent, type, message) {
    if (
      extra.isNullOrUndefinde(parent) === false &&
      extra.isNullOrUndefinde(parent.$refs) === false
    ) {
      // eslint-disable-next-line no-prototype-builtins
      if (parent.$refs.hasOwnProperty("refAlertPopup") === true) {
        if (type === "error") {
          parent.$refs.refAlertPopup.ShowDialog(type, "오류", message, null);
        } else if (type === "ok") {
          parent.$refs.refAlertPopup.ShowDialog(type, "완료", message, null);
        }
      } else {
        extra.showToast(
          parent,
          "error",
          "TextTialog 컴포넌트가 추가되어 있지 않습니다."
        );
      }
    }
  },
  showAlert(parent, title, icon, message) {
    if (
      extra.isNullOrUndefinde(parent) === false &&
      extra.isNullOrUndefinde(parent.$refs) === false
    ) {
      // eslint-disable-next-line no-prototype-builtins
      if (parent.$refs.hasOwnProperty("refAlertPopup") === true) {
        parent.$refs.refAlertPopup.ShowDialog(title, icon, message);
      } else {
        extra.showToast(
          parent,
          "error",
          "TextTialog 컴포넌트가 추가되어 있지 않습니다."
        );
      }
    }
  },
  getDistM(start, end) {
    function deg2rad(deg) {
      return deg * (Math.PI / 180);
    }
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(start.latitude - end.latitude); // deg2rad below
    const dLon = deg2rad(start.longitude - end.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(start.latitude)) *
        Math.cos(deg2rad(end.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distance in km
    return d;
  },
  getArrayDepth(arrData, depth) {
    if (Array.isArray(arrData)) {
      const subData = arrData[0];
      return this.getArrayDepth(subData, depth + 1);
    } else {
      return depth;
    }
  },
  isNullOrUndefinde(data) {
    if (typeof data === "undefined" || data === null) {
      return true;
    }
    return false;
  },
  isNullOrUndefindeOrEmpty(data) {
    if (typeof data === "undefined" || data === null || data === "") {
      return true;
    }
    return false;
  },
  ShowFullScreenLoading() {
    Loading.show(spinnerOption);
  },
  HideFullScreenLoading() {
    Loading.hide();
  },
  callToExternalFunction(funcName, params) {
    const systemOs = this.getAgentSystem();
    console.log(systemOs + "ffff");

    /*  if (systemOs === "windows") {
      window.postMessage(
        { type: "callToJs", funcName, params },
        "http://localhost:8080"
      ); // C#연동 시
    } else {
      window.postMessage({ type: "callFromVueToJs", funcName, params }); // 안드로이드 연동 시,
    } */

    // eslint-disable-next-line no-undef
    if (typeof CefSharp !== "undefined" && CefSharp !== null) {
      // eslint-disable-next-line no-undef
      console.log("CefSharp = ", CefSharp);
      window.postMessage(
        { type: "callFromVueToJs", funcName, params },
        "http://localhost:8081"
      ); // C#연동 시
      // eslint-disable-next-line no-undef
    } else if (typeof android !== "undefined" && android !== null) {
      // eslint-disable-next-line no-undef
      window.postMessage({ type: "callFromVueToJs", funcName, params }); // 안드로이드 연동 시,
    } else {
      // eslint-disable-next-line no-undef
      window.postMessage({ type: "callFromVueToJs", funcName, params }); // 안드로이드 연동 시,
    }
  },
  getAgentSystem() {
    if ("navigator" in window === false) {
      return "unknown";
    }
    // Use the modern 'web hints' provied by
    // 'userAgentData' if available, else use
    // the deprecated 'platform' as fallback.
    let platform = "unknown";
    if (
      this.isNullOrUndefinde(navigator.userAgentData) === false &&
      this.isNullOrUndefinde(navigator.userAgentData.platform) === false
    ) {
      platform = navigator.userAgentData.platform;
    } else if (this.isNullOrUndefinde(navigator.platform) === false) {
      platform = navigator.platform;
    }
    if (platform.startsWith("win") === true) return "windows";
    if (platform.startsWith("mac") === true) return "macos";
    if (platform.startsWith("linux") === true) return "linux";
    return "unknown";
  },
  callToPayment(params) {
    const S_RQ01 = params.S_RQ01; // 전문구분
    const S_RQ02 = params.S_RQ02; // 금액
    const S_RQ03 = params.S_RQ03 || "00"; // 할부
    const S_RQ04 = params.S_RQ04 || "20"; // 타임아웃
    const S_RQ05 = params.S_RQ05 || "A"; // 부가세
    const RQ08 = params.RQ08; // 거래고유번호
    const RQ09 = params.RQ08; // 웹전송메세지(이전 거래내역 확인용)
    const RQ10 = params.RQ10 || "NNNY"; // 이지카드 옵션

    const C_No = params.C_No;
    const C_date = params.C_date;

    let query;

    switch (S_RQ01) {
      case "D1":
        query = `${S_RQ01}^^${S_RQ02}^${S_RQ03}^${C_date}^${C_No}^^^^${RQ10}^^${S_RQ04}^${S_RQ05}^^UTF-8^^^^^^^^^`;
        break;
      case "D4":
        query = `${S_RQ01}^^${S_RQ02}^${S_RQ03}^${C_date}^${C_No}^^${RQ08}^${RQ09}^${RQ10}^^${S_RQ04}^${S_RQ05}^^UTF-8^^^^^^^^^`;
        break;
      default:
    }

    let result;
    $.ajax({
      url: "http://127.0.0.1:8090/",
      dataType: "jsonp",
      jsonp: "callback",
      data: { REQ: query },
      async: false,
      cache: true,
      success: function (data) {
        result = data;
        if (result.RS04 == "0000") {
          EventBus.$emit("result", result);
        } else {
          EventBus.$emit("errResult", result)
        }
      },
      error: function (e) {
        console.log("에러발생", e);
      },
    });
  },
};

export default extra;
