import bxlpos from "src/utils/bxlpos.js";
import bxlcommons from "src/utils/bxlcommon";

var LF = "\n";
var issueID = 1;
// var tmp = "123456789"
// var arrSymbol = [0, 1, 2, 3, 5, 6, 4, 7, 8];


const OrderPrint = {
changeInch() {
    _inch = type_inch.value;
},
viewResult(result) {
    console.log(result)
},
ringAlarm(){
    bxlpos.setPosId(issueID);
    bxlpos.checkPrinterStatus();

    bxlpos.setAlarm(alarm_count.value);

    var strSubmit = getPosData();
    console.log(strSubmit);

    issueID++;
    bxlcommons.requestPrint("Printer1", strSubmit, OrderPrint.viewResult);
},
PrintReceipt(tableData) { // 홀, 주방
    bxlpos.setPosId(issueID);
    bxlpos.checkPrinterStatus();

    console.log("프린트", tableData)
    
            //// 홀
            bxlpos.printText("[주문서]\n\n", 0, 1, false, false, false, 0, 1);
            if(tableData[0].table_name != "") {
                bxlpos.printText("테이블번호 : " + tableData[0].table_name + "\n주문시간 : " + tableData[0].order_dt + "\n", 0, 0, false, false, false, 0, 0);
            } else {
                bxlpos.printText("주문번호 : " + tableData[0].order_no + "\n주문시간 : " + tableData[0].order_dt + "\n", 0, 0, false, false, false, 0, 0);
            }
            bxlpos.printText("비고 : " + tableData[0].prod[0].remark + "\n", 0, 1, false, false, false, 0, 0);
            bxlpos.printText("==========================================\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("    메뉴명                      수량       \n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
            for (let j = 0; j < tableData[0].prod.length; j++) {
                bxlpos.printText(`${tableData[0].prod[j].prod_name.padEnd(15)} ${tableData[0].prod[j].qty.toString().padStart(12)}\n`, 0, 0, false, false, false, 0, 0);
                if(tableData[0].prod[j].prod_set[0].prod_name != undefined) {
                    for (let k = 0; k < tableData[0].prod[j].prod_set.length; k++) {
                        bxlpos.printText(`▶${tableData[0].prod[j].prod_set[k].prod_name.padEnd(15)} ${tableData[0].prod[j].prod_set[k].qty.toString().padStart(15)} \n`, 0, 0, false, false, false, 0, 0);
                    }
                }
            }
            bxlpos.printText("==========================================\n\n", 0, 0, false, false, false, 0, 0);
            if(tableData[0].table_name != "") {
                bxlpos.printText("[테이블번호] : " + tableData[0].table_name + "\n\n", 0, 1, false, false, false, 0, 1);
            } else {
                bxlpos.printText("[주문번호] : " + tableData[0].order_no + "\n\n", 0, 1, false, false, false, 0, 1);
            }

            bxlpos.printText("\n\n", 0, 0, false, false, false, 0, 0);
            bxlpos.cutPaper(1);
            var strSubmit = bxlpos.getPosData();
            issueID++;
           // bxlcommons.requestPrint("PrinterHall", strSubmit, OrderPrint.viewResult);

            //// 주방
            bxlpos.printText("[주문서]\n\n", 0, 1, false, false, false, 0, 1);
            if(tableData[0].table_name != "") {
                bxlpos.printText("테이블번호 : " + tableData[0].table_name + "\n주문시간 : " + tableData[0].order_dt + "\n", 0, 0, false, false, false, 0, 0);
            } else {
                bxlpos.printText("주문번호 : " + tableData[0].order_no + "\n주문시간 : " + tableData[0].order_dt + "\n", 0, 0, false, false, false, 0, 0);
            }
            bxlpos.printText("비고 : " + tableData[0].prod[0].remark + "\n", 0, 1, false, false, false, 0, 0);
            bxlpos.printText("==========================================\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("    메뉴명                      수량       \n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
            for (let j = 0; j < tableData[0].prod.length; j++) {
                bxlpos.printText(` ${tableData[0].prod[j].prod_name.padEnd(15)} ${tableData[0].prod[j].qty.toString().padStart(11)}\n`, 0, 1, false, false, false, 0, 0);
                if(tableData[0].prod[j].prod_set[0].prod_name != undefined) {
                    for (let k = 0; k < tableData[0].prod[j].prod_set.length; k++) {
                        bxlpos.printText(`▶${tableData[0].prod[j].prod_set[k].prod_name.padEnd(15)} ${tableData[0].prod[j].prod_set[k].qty.toString().padStart(15)} \n`, 0, 1, false, false, false, 0, 0);
                    }
                }
            }
            bxlpos.printText("==========================================\n\n\n", 0, 0, false, false, false, 0, 0);
            if(tableData[0].table_name != "") {
                bxlpos.printText("[테이블번호] : " + tableData[0].table_name + "\n\n", 0, 1, false, false, false, 0, 1);
            } else {
                bxlpos.printText("[주문번호] : " + tableData[0].order_no + "\n\n", 0, 1, false, false, false, 0, 1);
            }

            bxlpos.printText("\n\n", 0, 0, false, false, false, 0, 0);
            bxlpos.cutPaper(1);
            var strSubmit = bxlpos.getPosData();
            issueID++;
            bxlcommons.requestPrint("PrinterKichen", strSubmit, OrderPrint.viewResult);

            return true;
        },  

    CustReceipt(receiptCust) {
        bxlpos.setPosId(issueID);
        bxlpos.checkPrinterStatus();

        function format(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function formatDate(datatime) {
            const ok_dateYY = datatime.substr(8, 2);
            const ok_dateMM = datatime.substr(0, 2);
            const ok_dateDD = datatime.substr(3, 2);
            let newMM;
            let newDD;
            if (ok_dateDD.trim().length == 1) {
                newDD = `0${ok_dateDD.trim()}`;
            } else {
                newDD = ok_dateDD;
            }
            if (ok_dateMM.trim().length == 1) {
                newMM = `0${ok_dateMM.trim()}`;
            } else {
                newMM = ok_dateMM;
            }

            const ok_DATE = `${ok_dateYY}-${newMM}-${newDD}`;
            return ok_DATE;
        }
        
            console.log("키오스크 결제영수증!", receiptCust);
            bxlpos.printText("영수증\n\n", 0, 1, false, false, false, 0, 1);
            bxlpos.printText(receiptCust.cust_name + "\n영업일자 : " + receiptCust.reg_date + "\n주문번호 : " + receiptCust.order_no + "\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("영수증 번호 : " + receiptCust.receipt_no + "\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("==========================================\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("    메뉴명             수량         가격  \n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
            for (let j = 0; j < receiptCust.prod.length; j++) {
                let len = receiptCust.prod[j].prod_name.length
                bxlpos.printText(` ${receiptCust.prod[j].prod_name.padEnd(24 - len)} ${receiptCust.prod[j].qty.toString().padStart(1)} ${format(receiptCust.prod[j].price.toString()).padStart(15)}\n`, 0, 0, false, false, false, 0, 0);
                if(receiptCust.prod[j].prod_set[0].prod_name != undefined) {
                    for (let k = 0; k < receiptCust.prod[j].prod_set.length; k++) {
                        let len2 = receiptCust.prod[j].prod_set[k].prod_name.length
                        bxlpos.printText(` ▶${receiptCust.prod[j].prod_set[k].prod_name.padEnd(20 - len2)} ${receiptCust.prod[j].prod_set[k].qty.toString().padStart(1)} ${format(receiptCust.prod[j].prod_set[k].price).toString().padStart(15)}\n`, 0, 0, false, false, false, 0, 0);
                    }
                }
            }
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText(`합계금액 ${format(receiptCust.amt).padStart(32)} \n`, 0, 0, false, false, false, 0, 0);
            bxlpos.printText(`과세물품가액 ${format(receiptCust.amt_tot_vat0).padStart(28)} \n`, 0, 0, false, false, false, 0, 0);
            bxlpos.printText(`부가세 ${format(receiptCust.amt_vat).padStart(34)} \n`, 0, 0, false, false, false, 0, 0);
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText(`현금결제금액 ${format(receiptCust.amt_cash).padStart(28)}\n`, 0, 1, true, false, false, 0, 0);
            bxlpos.printText(`카드결제금액 ${format(receiptCust.amt_card).padStart(28)} \n`, 0, 1, true, false, false, 0, 0);
            bxlpos.printText("------------------------------------------\n", 0, 0, false, false, false, 0, 0); 
            bxlpos.printText(`총 금액 ${format(receiptCust.amt_tot).padStart(33)}\n`, 0, 1, true, false, false, 0, 0);
            bxlpos.printText(`결제금액 ${format(receiptCust.amt_pay).padStart(32)} \n`, 0, 1, true, false, false, 0, 0);
            bxlpos.printText("==========================================\n", 0, 0, false, false, false, 0, 0);
            bxlpos.printText( "[주문번호] : " + receiptCust.order_no + "\n", 1, 1, false, false, false, 0, 1);
            bxlpos.printText("==========================================\n", 0, 0, false, false, false, 0, 0);

            receiptCust.payInfo.forEach((i)=>{
               if(i.card_no != undefined){
                console.log("card",i)
                bxlpos.printText("*****카드거래명세표(고객용)*****\n\n", 0, 0, false, false, false, 0, 1);
                bxlpos.printText(`카드번호 ${i.card_no.padStart(32)} \n`, 0, 0, false, false, false, 0, 0);
                bxlpos.printText(`카드종류 ${i.card_name.padStart(28)} \n`, 0, 0, false, false, false, 0, 0);
                if(i.ok_flag == "승인") {
                    bxlpos.printText(`승인일자 ${formatDate(i.ok_datatime).padStart(32)}\n`, 0, 0, false, false, false, 0, 0);
                } else {
                    bxlpos.printText(`취소일자 ${formatDate(i.cancel_datatime).padStart(32)} \n`, 0, 0, false, false, false, 0, 0);
                }
                bxlpos.printText(`승인금액 ${format(i.amt_pay).padStart(32)} \n`, 0, 0, false, false, false, 0, 0);
                bxlpos.printText(`승인여부 ${i.ok_flag.padStart(30)} \n`, 0, 0, false, false, false, 0, 0);
                bxlpos.printText("==========================================\n\n", 0, 0, false, false, false, 0, 0);
                }  
                return;
            }); 

            bxlpos.print1DBarcode(`${receiptCust.payInfo[0].ok_no}`,8,3,70,2,1);
            bxlpos.printText("\n\n", 0, 0, false, false, false, 0, 0);
            bxlpos.cutPaper(1);

            var strSubmit = bxlpos.getPosData();
            issueID++;
            bxlcommons.requestPrint("PrinterHall", strSubmit, OrderPrint.viewResult); // 키오스크 프린터로 연결해야함

            return true;
        },

    }

export default OrderPrint;