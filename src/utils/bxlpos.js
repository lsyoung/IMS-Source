var pos_data = { id: 0, functions: {} };
var pos_func = {};
var incPosNum = 0;

const bxlpos = {



getPosData() {
  pos_data.functions = pos_func;
  pos_func = {};
  incPosNum = 0;

  return JSON.stringify(pos_data);
},
setPosId(setId) {
  pos_data.id = setId;
},

checkPrinterStatus() {
  var _a = { checkPrinterStatus: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

directPrintText(text) {
  var _a = { directPrintText: [text] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

directPrintHex(hexString) {
  var _a = { directPrintHex: [hexString] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

cutPaper(bFeedCut) {
  var _a = { cutPaper: [bFeedCut] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

setInternationalCharset(ics) {
  var _a = { setInternationalCharset: [ics] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

setCharacterset(charset) {
  var _a = { setCharacterset: [charset] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printText(
  text,
  horizontal,
  vertical,
  bold,
  invert,
  underline,
  fonttype,
  alignment
) {
  var _a = {
    printText: [
      text,
      horizontal,
      vertical,
      bold,
      invert,
      underline,
      fonttype,
      alignment,
    ],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

print1DBarcode(
  data,
  symbol,
  barWidth,
  height,
  hriPosition,
  alignment
) {
  var _a = {
    print1DBarcode: [data, symbol, barWidth, height, hriPosition, alignment],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printPDF417(
  data,
  symbol,
  alignment,
  columnNumber,
  rowNumber,
  moduleWidth,
  moduleHeight,
  eccLevel
) {
  var _a = {
    printPDF417: [
      data,
      symbol,
      alignment,
      columnNumber,
      rowNumber,
      moduleWidth,
      moduleHeight,
      eccLevel,
    ],
  };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printQRCode(data, model, alignment, moduleSize, eccLevel) {
  var _a = { printQRCode: [data, model, alignment, moduleSize, eccLevel] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printGS1Databar(data, symbol, alignment, moduleSize) {
  var _a = { printGS1Databar: [data, symbol, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printDataMatrix(data, alignment, moduleSize) {
  var _a = { printDataMatrix: [data, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

printCompositeBarcode(data, symbol, alignment, moduleSize) {
  var _a = { printCompositeBarcode: [data, symbol, alignment, moduleSize] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 printBitmap(imagedata, width, alignment, dither) {
  var _a = { printBitmap: [imagedata, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 printBitmapFile(filepath, width, alignment, dither) {
  var _a = { printBitmapFile: [filepath, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 printPDFFile(filepath, pageNumber, width, alignment, dither) {
  var _a = { printPDFFile: [filepath, pageNumber, width, alignment, dither] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 pagemodeBegin() {
  var _a = { pagemodeBegin: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 pagemodePrintArea(width, height) {
  var _a = { pagemodePrintArea: [width, height] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 pagemodePrintPosition(x, y) {
  var _a = { pagemodePrintPosition: [x, y] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 pagemodePrintDirection(direction) {
  var _a = { pagemodePrintDirection: [direction] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 pagemodeEnd() {
  var _a = { pagemodeEnd: [] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 openDrawer(pinNumber) {
  var _a = { openDrawer: [pinNumber] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
},

 setAlarm(count) {
  var _a = { setAlarm: [count] };
  pos_func["func" + incPosNum] = _a;
  incPosNum++;
}
}

export default bxlpos;