// 'use strict'; 参考:  https://www.tam-tam.co.jp/tipsnote/javascript/post11736.html
// let dia  = $("#dia_set").val().split(/\\|\\/)[2];

var file = document.getElementById('dia_set');
var ted = document.getElementById('ted');
var tee = [];
let tee_count = 0;

$("#tee").width(692);
$("#tee").height(510);
 
// File APIに対応しているか確認
if(window.File && window.FileReader && window.FileList && window.Blob) {
  function loadLocalCsv(e) {
      // ファイル情報を取得
      var fileData = e.target.files[0];
      console.log(fileData); // 取得した内容の確認用

      // CSVファイル以外は処理を止める
      if(!fileData.name.match('.csv$')) {
          alert('CSVファイルを選択してください');
          return;
      }

      // FileReaderオブジェクトを使ってファイル読み込み
      var reader = new FileReader();
      // ファイル読み込みに成功したときの処理
      reader.onload = function() {
          var cols = reader.result.split('\n');
          // console.log(cols)
          var data = [];
          for (var i = 0; i < cols.length; i++) {
              data[i] = cols[i].split(',');
          }
          // console.log(data);
          tee = data;
      }
      // ファイル読み込みを実行
      reader.readAsText(fileData, 'Shift_JIS');
  }
  file.addEventListener('change', loadLocalCsv, false);

} else {
  file.style.display = 'none';
  $("#tee").val("File APIに対応したブラウザでご確認ください");
}


$("#up").on('click', function(){
  up();
});
function up(){
  tee_count--;
  var insert = createTable(tee, tee_count);
  ted.innerText = "";
  ted.appendChild(insert);
}

$("#down").on('click', function(){
  down();
});

function down(){
  tee_count++;
  var insert = createTable(tee, tee_count);
  ted.innerText = "";
  ted.appendChild(insert);
}


// CSVファイル: Tableタグで出力
function createTable(data, count) {

  var table = document.createElement('table');
  // 一行ごとに出力
  // 1列車ごとにtrタグでまとめられる
  // for (var i = 0; i < data.length; i++) {
      var tr = document.createElement('tr');
      // console.log("i:" + i);
      // 見出し
      for (var j = 0; j < data[0].length; j++) {
        // console.log("j: "+j);
          var td = document.createElement('td');
          td.innerText = data[0][j];
          tr.appendChild(td);
      }
      table.appendChild(tr);
      var tr = document.createElement('tr');
      // 一行中の一列(1マス)ごとに
      for (var j = 0; j < data[count].length; j++) {
        // console.log("j: "+j);
          var td = document.createElement('td');
          td.innerText = data[count][j];
          tr.appendChild(td);
      }

      table.appendChild(tr);
      table.border=1;
  // }
  return table;
}

// 放送用パーツセット
let atos_sentence = [
  ["電車"], //列車・電車
  [""], //番線
  [""], //時刻:A
  [""], //路線:A(付帯パーツ付)
  [""], //種別:A
  [""], //列車名:A
  [""], //号数:A
  [""], //行先:A
  [""], //両数:A
  [""], //時刻:B
  [""], //路線:B(付帯パーツ付)
  [""], //種別:B
  [""], //列車名:B
  [""], //号数:B
  [""], //行先:B
  [""], //ドア
  [""] //両数:B
]

let t_no_hnd = "", t_no_ten = "", t_no = "";
  // 時刻
let t_hour_ten = "", t_min_ten = "", t_hour = "0時", t_min = "ちょうど";

  // atos放送パーツセット
function atos_set(mode){
  atos_sentence[0] = tee[tee_count][20];
  atos_sentence[0] = atos_sentence[0].split('\r')[0];
  // 番線
  atos_sentence[1] = tee[tee_count][1]+"番線";
  // 時刻A:
  atos_sentence[2] = time_set(tee[tee_count][0].split(':')[0], tee[tee_count][0].split(':')[1]);
  // 路線名a
  atos_sentence[3] = line_join(tee[tee_count][3], tee[tee_count][4]);
  // 種別A
  atos_sentence[4] = tee[tee_count][5];
  // 愛称A
  atos_sentence[5] = tee[tee_count][6];
  // 号数A
  atos_sentence[6] = gosu(tee[tee_count][7]);
  //  行先A
  atos_sentence[7] = tee[tee_count][8];
  // 両数A:
  atos_sentence[8] = tee[tee_count][10];
  // ドア数
  atos_sentence[15] = tee[tee_count][9].split(':')[0];

  // 行先B or 増解結駅
  atos_sentence[14] = tee[tee_count][18];
  // 両数B or 増解結両数
  atos_sentence[16] = tee[tee_count][19];
  // 列車Bがある場合
  if(mode>=4){
    // 時刻B
    atos_sentence[9] = time_set(tee[tee_count][12].split(':')[0], tee[tee_count][12].split(':')[1]);
  　// 路線名B
    atos_sentence[10] = line_join(tee[tee_count][13], tee[tee_count][14]);
    // 種別B
    atos_sentence[11] = tee[tee_count][15];
    // 愛称B
    atos_sentence[12] = tee[tee_count][16];
    // 号数B
    atos_sentence[13] = gosu(tee[tee_count][17]);
  }
}

// 時間処理の関数
function time_set(hour_x, minut){
  if(hour_x != "" && minut != ""){
    if(hour_x >= 21){
      t_hour_ten = "20\n";
      t_hour = hour_x - 20 + "時\n"
    }else if(hour_x >= 11 && hour_x <= 19){
        t_hour_ten = "10\n";
        t_hour = hour_x - 10 + "時\n"
    }else/* if(hour_x <= 10 || hour_x === 20)*/{
      t_hour_ten = "";
      t_hour = hour_x + "時\n";
    }
    // 1~9分まで
    if(minut >= 1 && minut < 10){
      t_min = minut.slice(1, 2) + "分\n";
      t_min_ten = "";
      // ちょうどの場合
    }else if(minut === "00"){
      t_min = "ちょうど\n";
      t_min_ten = "";
      // 10分20分etc,,,
    }else if(minut.slice(1, 2) === "0" && minut != "00"){
      t_min = minut.slice(0, 1) + "0分\n";
      t_min_ten = "";
      // それ以外
    }else{
      t_min_ten = minut.slice(0, 1) + "0\n";
      t_min = minut.slice(1, 2) + "分\n"
    }
    return t_hour_ten+ t_hour + t_min_ten + t_min +"発\n";
  }
}

// 路線名:一括パーツ検索等の処理
function line_join(line_name, ad_part){
  if(ad_part == "直通"){
    for(d=0;d<train_line.length;d++){
    // 直通一括パーツ検索
      if(line_name+"直通" === train_line[d][1]){
        return train_line[d][1];
      }else if(d === (train_line.length-1) && line_name+"直通" != train_line[d][1]){
        return line_name + "\n直通";
      }
    }
  // 周り
  }else if(ad_part == "周り"){
    return atos_sentence[3] + "\n周り";
  // 経由
  }else if(ad_part == "経由"){
    for(d=0;d<train_line.length;d++){
      // 直通一括パーツ検索
        if(line_name+"経由" === train_line[d][1]){
          return train_line[d][1];
        }else if(d === (train_line.length-1) && line_name+"経由" != train_line[d][1]){
          return line_name + "\n経由";
        }
      }
  // 無し(パーツ残存)
  }else if(ad_part == ""){
    return line_name;
    // 戸閉放送時のみ案内の場合
  }else if(ad_part == "戸閉"){
    return null;
  }
}

// 号数パーツ処理
function gosu(parts){
  if(parts!=""){
    let hnd = "", ten = "", one = "";
    // 100単位ある
    if(parts.length==4){
      hnd = parts[0];
      ten = parts[1];
      one = parts[2];
      // 10単位ある
    }else if(parts.length==3){
      hnd = 0;
      ten = parts[0];
      one = parts[1];
      // 1単位のみ
    }else if(parts.length==2){
      hnd = 0;
      ten = 0
      one = parts[0];
    }else{
      return "";
    }
    // 100の位の処理
    if(hnd == 0){
      t_no_hnd = "";
    }else if(hnd != 0){
      t_no_hnd = hnd + "00";
    }
    // 10の位
    if(ten == 0){
      t_no_ten = "";
    }else if(ten != 0){
      t_no_ten = "\n" + ten + "0";
    }
    // 1の位
    if(one != 0){
      t_no = "\n"+one;
    }else{
      t_no = "号";
    }
    return t_no_hnd + t_no_ten + t_no + "号";
  }
  
}