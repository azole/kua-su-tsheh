//判斷瀏覽器是否支援FileReader物件

// 以下為重要固定參數
var FixMaxRow = 9; //  Canvas 列數  9
var FixMaxCol = 28; //  Canvas 行數  28
var FixFontKha = 30; //  Canvas 漢字   30x30
var FixFontEng = 18; //  Canvas 英數字 18x18
var FixFontGap = 5; //  每組(FontKha + FontEng)間距
var FixMaxRowHeight = FixFontKha + FixFontEng + FixFontGap; //  53  px  (30 + 18 + 5)
var FixCanvWidth = 848;
var FixCanvHeight = 477;
// 以上為重要固定參數

// 以下為重要Canvas參數
var CanPageRowNum = 0; // 在 Page 裡第幾列  row, 與CanPageLineNum相同
var CanPrevRowNum = 0;
var CanPageRowStr = '';
var CanPageColNum = 0; // 在 Page 裡第幾行  column
var CanPrevColNum = 0;
var CanPageColStr = '';
var CanFileLineNum = 0; // 在整體漢字檔裡第幾 Line
var CanFileLineStr = '';
var CanFileJumpNum = 0; // 在整體漢字檔裡第幾 Jump
var JumpIdx = 0;
var CanFileJumpStr = '';
var JumpIdx = 0;
var CanJumpTimeNum = 0; // 每一個jump的時間
var CanJumpTimeStr = '';
var CanPC = ''; // Jump Page(p) or Jump Column(c)
var obj = document.getElementById('myCanvas');
var ctx = obj.getContext('2d');
ctx.strokeRect(0, 0, 848, 477);
//ctx.fillStyle="blue";
// 以上為重要Canvas參數
var ArrTimeElement;
var X0D = '\r'; // Carriage Return
var X0A = '\n'; // New Line
var Xbr = '<br>'; // 在 Form 上換行
var LineIdx = 0;
var LineTxt = '';
var TimeTxt = '';
var JumpTxt = '';
var LineCnt = 0;
var NewTotTxt = ''; //在  Form上全部資料
var arrTxt = [];
var arrKha = [];
var arrRom = [];
var arrTime = [];
var arrTimeTxt;
var LenKha = 0;
var LenRom = 0;
var LenTime = 0;
var I1 = 0;
var I2 = 0;
var I3 = 0;
var x = 0;
var y = 0;
var Prevx = 0;
var Prevy = 0;
var TimeIdx = 0;
var CurrTime = 0;
var TempTxt = '';
var NumIn = 0;
var StrOut = '';
var OneByte;
var TotTxt = ''; // 在檔案上全部資料
var strLen = 0; // 在檔案上的資料長度
var reader;
let timer;
reader = new FileReader();
var file1 = document.getElementById('file0');
file1.onchange = function () {
  var file2 = file1.files[0];
  reader.readAsText(file2);
  reader.onload = function () {
    // document.getElementById('disp1').innerHTML = reader.result;
    TotTxt = reader.result;
    strLen = TotTxt.length;
    MoveArrRec();
    LineCnt = LineIdx;
    //	document.getElementById('disp1').innerHTML = TotTxt;
    MoveArrThree();
    PlayAudio();
    TimeIdx = 0;
    LineIdx = 0;
    CurrTime = 0;
    JumpIdx = 0;
    timer = setInterval(TimeHit, 100);
  };
};

function MoveArrRec() {
  for (let i = 0; i <= strLen; i++) {
    OneByte = TotTxt.substr(i, 1);
    if (OneByte == X0D || i == strLen) {
      // 	||是 or 之意, 這是因為有些檔案最後兩bytes 不是0D0A
      //   所以須考慮此況
      MoveElement();
      i++;
    } else {
      LineTxt = LineTxt + OneByte;
    }
  }
}

function MoveArrThree() {
  LineIdx = 0;
  //	alert("MoveArrThree");
  for (let i = 0; i < LineCnt; i++) {
    LineTxt = arrTxt[i];
    LenKha = Number(LineTxt.substr(0, 2));
    I1 = LenKha + 3;
    LenRom = Number(LineTxt.substr(I1, 3));
    I2 = LenKha + LenRom + 6;
    LenTime = Number(LineTxt.substr(I2, 3));
    //	alert("第"+i+"筆");
    arrKha[i] = LineTxt.substr(2, LenKha);
    arrRom[i] = LineTxt.substr(I1 + 3, LenRom);
    //	alert("I2 = " + I2 + "LenTime = " + LenTime);
    TimeTxt = LineTxt.substr(I2, LenTime + 4);
    //	alert("TimeTxt = " + TimeTxt);

    MoveArrTime();
    //alert("LineIdx = " + LineIdx);

    //alert("arrKha[] = " + arrKha[LineIdx]);
    //alert("arrRom[] = " + arrRom[LineIdx]);
    //alert("arrTimeTxt = " + arrTimeTxt);
    LineIdx = LineIdx + 1;
  }
}

function MoveArrTime() {
  I1 = Number(TimeTxt.substr(0, 3)) / 14; // 本line有幾個jump
  CanPageColNum = 0;
  for (let i = 0; i < I1; i++) {
    JumpTxt = TimeTxt.substr(4 + i * 14, 14);
    CanFileLineStr = JumpTxt.substr(0, 4);
    CanFileLineNum = Number(CanFileLineStr);
    CanPageRowNum = CanFileLineNum % FixMaxRow;

    if (CanPageRowNum == 0) {
      CanPageRowNum = FixMaxRow;
    }

    NumIn = CanPageRowNum;
    toString2();
    CanPageRowStr = StrOut;

    CanPageColStr = JumpTxt.substr(12, 2);

    CanPageColNum = Number(CanPageColStr);

    if ((CanPageRowNum == 1) & (i == 0)) {
      CanPC = 'P';
    } else {
      CanPC = 'C';
    }

    NumIn = CanFileJumpNum;
    toString5();
    CanFileJumpStr = StrOut;
    CanJumpTimeStr = JumpTxt.substr(5, 5);
    arrTime[CanFileJumpNum] = CanPC + CanJumpTimeStr + CanPageRowStr + CanPageColStr + CanFileLineStr;
    arrTimeTxt = CanPC + '*' + CanJumpTimeStr + '*' + CanPageRowStr + '*' + CanPageColStr + '*' + CanFileLineStr;
    CanFileJumpNum = CanFileJumpNum + 1;
  }
}

function MoveElement() {
  if (LineTxt.length > 0) {
    arrTxt[LineIdx] = LineTxt;
    LineTxt = '';
    LineIdx++;
  }
}

function DispArray() {
  for (let x in arrTxt) {
    NewTotTxt = NewTotTxt + arrTxt[x] + Xbr;
  }
  //	document.getElementById('disp3').innerHTML = NewTotTxt;
}

function toString2() {
  if (NumIn < 10) {
    StrOut = '0' + NumIn.toString();
  } else {
    StrOut = NumIn.toString();
  }
}
function toString3() {
  if (NumIn < 10) {
    StrOut = '00' + NumIn.toString();
  } else if (NumIn < 100) {
    StrOut = '0' + NumIn.toString();
  } else {
    StrOut = NumIn.toString();
  }
}

function toString4() {
  if (NumIn < 10) {
    StrOut = '000' + NumIn.toString();
  } else if (NumIn < 100) {
    StrOut = '00' + NumIn.toString();
  } else if (NumIn < 1000) {
    StrOut = '0' + NumIn.toString();
  } else {
    StrOut = NumIn.toString();
  }
}
function toString5() {
  if (NumIn < 10) {
    StrOut = '0000' + NumIn.toString();
  } else if (NumIn < 100) {
    StrOut = '000' + NumIn.toString();
  } else if (NumIn < 1000) {
    StrOut = '00' + NumIn.toString();
  } else if (NumIn < 10000) {
    StrOut = '0' + NumIn.toString();
  } else {
    StrOut = NumIn.toString();
  }
}

function TimeHit() {
  arrTimeTxt = arrTime[JumpIdx];
  console.log('arrTimeTxt', arrTimeTxt);
  CurrTime = Number(arrTimeTxt.substr(1, 5));
  console.log('CurrTime', CurrTime);

  if (TimeIdx < CurrTime) {
    TimeIdx = TimeIdx + 1;
  } else {
    // document.getElementById('disp2').innerHTML = arrTimeTxt;
    CanPC = arrTimeTxt.substr(0, 1);
    if (CanPC == 'P') {
      Move2Canvas();
      x = Number(arrTimeTxt.substr(8, 2)) * FixFontKha - FixFontKha;
      y = Number(arrTimeTxt.substr(6, 2)) * FixMaxRowHeight - FixFontGap * 2;
      Prevx = x;
      Prevy = y;
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, 30, 6);
    } else {
      ctx.fillStyle = 'white';
      ctx.fillRect(Prevx, Prevy, 30, 6);
      x = Number(arrTimeTxt.substr(8, 2)) * FixFontKha - FixFontKha;
      y = Number(arrTimeTxt.substr(6, 2)) * FixMaxRowHeight - FixFontGap * 2;
      Prevx = x;
      Prevy = y;
      ctx.fillStyle = 'blue';
      ctx.fillRect(x, y, 30, 6);
    }
    JumpIdx = JumpIdx + 1;
    TimeIdx = TimeIdx + 1;
  }
}

function Move2Canvas() {
  ctx.clearRect(0, 0, 848, 477);
  ctx.fillStyle = 'black';
  for (let i = 0; i < FixMaxRow; i++) {
    if (LineIdx >= LineCnt) {
      arrKha[LineIdx] = '';
      arrRom[LineIdx] = '';
    }

    ctx.font = '30px 標楷體';
    ctx.fillText(arrKha[LineIdx], 0, 40 + i * 53);
    ctx.font = '18px 標楷體';
    ctx.fillText(arrRom[LineIdx], 0, 15 + i * 53);
    LineIdx = LineIdx + 1;
  }
}

let audio;
function PlayAudio() {
  audio = document.createElement('audio');
  audio.setAttribute('id', 'playAudio');
  audio.src = 'Khng3Se3KuaIunn5.mp3';
  audio.play();
}

document.getElementById('btnPlay').addEventListener('click', function () {
  timer = setInterval(TimeHit, 100);
  audio.play();
});

document.getElementById('btnPause').addEventListener('click', function () {
  console.log();
  clearInterval(timer);
  audio.pause();
});
