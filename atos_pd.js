'use strict';

let atos_sentence = [
  [""], //列車・電車
  [""], //番線
  [""], //時刻:A
  [""], //路線:A(単体パーツ)
  [""], //路線:A(付帯パーツ付)
  [""], //種別:A
  [""], //列車名:A
  [""], //号数:A
  [""], //行先:A
  [""], //行先:B
  [""], //ドア:10
  [""], //両数
  [""], //切離し or 増結
  [""], //前,後ろ
  [""], //両数
  [""], //する駅
  [""] //固定入力
]

let t_no_hnd = "", t_no_ten = "", t_no = "";

function sentence_set(){
  if($('[name=type_1][value=0]').prop('checked')){
    atos_sentence[0] = "列車"
  }else if($('[name=type_1][value=1]').prop('checked')){
    atos_sentence[0] = "電車";
  }

  // 番線選択
  if($("#bansen").val() != 80){
    atos_sentence[1] = bansen_num[$("#bansen").val()][1];
  }else{
    atos_sentence[1] = "";
  }

  // 時刻
  hour_time($("#time_h").val());
  min_time($("#time_m").val());
  atos_sentence[2] = t_hour_ten+ t_hour + t_min_ten + t_min +"発\n";

  // 路線名
  // 元パーツ
  atos_sentence[3] = train_line[$("#line").val()][1];

  // 直通
  if($('[name=line_2][value=2]').prop('checked')){
    for(d=0;d<train_line.length;d++){
    // 直通一括パーツ検索
      if(atos_sentence[3]+"直通" === train_line[d][1]){
        atos_sentence[4]=atos_sentence[3]+"直通";
        break;
      }else if(d === (train_line.length-1) && atos_sentence[3]+"直通" != train_line[d][1]){
        atos_sentence[4] = atos_sentence[3] + "\n直通";
      }
    }
  // 周り
  }else if($('[name=line_2][value=3]').prop('checked')){
    atos_sentence[4] = atos_sentence[3] + "\n周り";
  // 経由
  }else if($('[name=line_2][value=1]').prop('checked')){
    for(d=0;d<train_line.length;d++){
      // 直通一括パーツ検索
        if(atos_sentence[3]+"経由" === train_line[d][1]){
          atos_sentence[4]=atos_sentence[3]+"経由";
          break;
        }else if(d === (train_line.length-1) && atos_sentence[3]+"経由" != train_line[d][1]){
          atos_sentence[4] = atos_sentence[3] + "\n経由";
        }
      }
  // 無し(パーツ残存)
  }else if($('[name=line_2][value=0]').prop('checked')){
    atos_sentence[4] = atos_sentence[3];
  // 無し
  }else if($('[name=line_2][value=4]').prop('checked')){
    atos_sentence[4] = "";
  }

  // 種別
  atos_sentence[5] = train_type[$("#kind").val()][1];

  // 愛称train_name_tf
  if($("#train_name_tf").prop("checked") == true){
    atos_sentence[6] = train_name[$("#train_name").val()][1];
  }else{
    atos_sentence[6] = "";
  }

  // 号数:
  // チェックの有無
  if($("#train_no_tf").prop("checked") == true){
    gosu($("#train_no_hnd").val(), $("#train_no_ten").val(), $("#train_no_one").val());
    atos_sentence[7] = t_no_hnd + t_no_ten + t_no;
  }else{
    atos_sentence[7] = "";
  }

  // 行き先
  atos_sentence[8] = buund_for[$("#destination").val()][1];  

  // 行先2
  atos_sentence[9] = buund_for[$("#destination_2").val()][1];

  //ドア数
  atos_sentence[10] = atos_cross[$("#doors").val()][1];
  // 両数
  atos_sentence[11] = cars[$("#cars").val()][1];

  // 増解結等他
  add_tr();


  // 手動固定入力
  if($("#ply_self").val() != ""){
    atos_sentence[16] = "空白0.5秒\n" + $("#ply_self").val();
  }else{
    atos_sentence[16] = "";
  }
  
}

// 増結・切離し
function add_tr(){
  // 増結選択時
  if($("#add_tr_a").val() === "0"){
    atos_sentence[12] = "増結"
    if($("#stop_sta").val() === "92_1"){
      atos_sentence[15] = "当駅で";
    }else{
      atos_sentence[15] = buund_for[$("#stop_sta").val()][1]+"\nで";
    }
    atos_sentence[13] = atos_cross[$("#add_tr_b").val()][1];
    atos_sentence[14] = cars[$("#add_tr_c").val()][1];

    // 切離し
  }else if($("#add_tr_a").val() === "1"){
    atos_sentence[12] = "切り離し"
    atos_sentence[13] = atos_cross[$("#add_tr_b").val()][1];
    atos_sentence[14] = cars[$("#add_tr_c").val()][1];
    if($("#stop_sta").val() === "92_1"){
      atos_sentence[15] = "当駅";
    }else{
      atos_sentence[15] = buund_for[$("#stop_sta").val()][1];
    }
      // なし
  }else if($("#add_tr_a").val() === "2"){
    atos_sentence[12] = "なし"
  }
}

// 時刻
let t_hour_ten = "";
let t_hour = "0時";
let t_min_ten = "";
let t_min = "ちょうど";

// 時間処理
function hour_time(hour_x){
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
}

// 分数(時間)処理の関数
function min_time(minut){
  // 9分まで,または1の位0
  if((minut >= 1 && minut < 10) || (minut.slice(1, 2) === "0" && minut != "0")){
    t_min = minut + "分\n";
    t_min_ten = "";
  }else if(minut === "0"){
    t_min = "ちょうど\n";
    t_min_ten = "";
  }else{
    // それ以外
      t_min_ten = minut.slice(0, 1) + "0\n";
      t_min = minut.slice(1, 2) + "分\n"
  }
}

// 号数パーツ処理
function gosu(hnd, ten, one){
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
  if(one != "0号"){
    t_no = "\n"+one;
  }else{
    t_no = "号";
  }
}