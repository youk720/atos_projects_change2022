'use strict';
let atos_mode = 0;

// 接近用:準詳細
let arrv = [
  ["接近メロディ"], //
  ["まもなく"],
  [""], //番線
  [""], //始発
  [""], //路線名・種別・愛称・号数
  [""], //行先
  [""], //行先B
  [""], //行きが・方面行きが(一括パーツない場合)
  ["まいります"], //まいります・到着します
  [""], //危険線:他
  [""], //ドア・両数
  [""], //切り離し等
  [""] //付帯
]

function arriv(){
  atos_mode = 2;
  list_link = [];
  playlist = [];
  $("#playlist_out").val("");
  // 元パーツセット
  sentence_set();

  // 接近メロディ設定
  arrv[0] = atos_melo_d[$("#arr_m").val()][1]+"\n空白0.5秒";
  arrv_smp[0] = atos_melo_d[$("#arr_m").val()][1]+"\n空白0.5秒";

  // 危険線:洗濯
  arrv[9] = "空白0.5秒\n"+atos_cross[$("#seafty").val()][1];
  arrv_smp[5] = atos_cross[$("#seafty").val()][1];


  // 放送種別選定:通常,当駅始発
  if($("#type_2").val() <= 1){
    arriv_1($("#type_2").val());
    $("#playlist_out").val(arrv.join('\n'));
    // 折返
  }else if($("#type_2").val() == 6){
    arriv_3(/*$("#type_2").val()*/);
    $("#playlist_out").val(back_atos.join('\n'));
    // その他簡易
  }else{
    arriv_2($("#type_2").val());
    $("#playlist_out").val(arrv_smp.join('\n'));
  }
}

// 通常接近:処理
function arriv_1(mode){
  if(atos_sentence[1]!=''){
    arrv[2] = atos_sentence[1]+"に";
  }else{
    arrv[2] = "";
  }
  
  // パーツ投入(路線・種別・愛称ほか)
  arrv[4]="";
  for(d=4;d<=7;d++){
    arrv[4] = arrv[4] + '\n'　+ atos_sentence[d];
  }
  // 行先セット
  dest_yukiga();
  // ドア・両数
  if ($("#door_car").prop('checked') == true) {
    arrv[10] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n"+reconciliation(2);
  }else{
    arrv[10] = "";
  }
  
  //増解結系
  arrv[11] = reconciliation(0);

  // 付帯
  arrv[12] = atos_sentence[16];
  if(mode == 1){
    arrv[3] = "当駅始発";
  }else{
    arrv[3] = "";
  }
}

// 簡易接近
let arrv_smp = [
  ["接近メロディ"], //
  ["まもなく"],
  [""], //番線
  [""], //
  [""], //
  [""], //危険線:他
  [""] //
]


function arriv_2(mode){
  switch (mode) {
    // 簡易
    case "2":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"に";
      }else{
        arrv_smp[2] = "";
      }
      arrv_smp[3] = atos_sentence[0]+"がまいります";
      arrv_smp[4] = "";
      arrv_smp[6] = ""; 
      break;

      // 通過
    case "4":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"を";
      }else{
        arrv_smp[2] = "";
      }
      if(atos_sentence[0] == "列車"){
        if(atos_sentence[5] == "回送" || atos_sentence[5] == "団体" || atos_sentence[5] == "貨物"){
          arrv_smp[3] = atos_sentence[5]+"列車が";
          arrv_smp[4] = "通過いたします";
          arrv_smp[6] = ""; 
        }else{
          arrv_smp[3] = atos_sentence[0]+"が";
          arrv_smp[4] = "通過いたします";
          arrv_smp[6] = ""; 
        }
      }else{
        arrv_smp[3] = atos_sentence[0]+"が";
        arrv_smp[4] = "通過いたします";
        arrv_smp[6] = ""; 
      }
    break;

    // 当駅止
    case "5":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"に";
      }else{
        arrv_smp[2] = "";
      }
      arrv_smp[3] = "当駅止まりの";
      arrv_smp[4] = atos_sentence[0]+"がまいります";
      arrv_smp[6] = ""; 
    break;

      // 種別のみ
    case "3":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"に";
      }else{
        arrv_smp[2] = "";
      }
      if(atos_sentence[0] == "列車"){
        if(atos_sentence[5] == "回送" || atos_sentence[5] == "団体" || atos_sentence[5] == "貨物"){
          arrv_smp[3] = atos_sentence[5]+"列車が";
          arrv_smp[4] = "まいります";
          arrv_smp[6] = ""; 
        }else{
          arrv_smp[3] = "列車がまいります";
          arrv_smp[4] = "";
          arrv_smp[6] = ""; 
        }
      }else{
        arrv_smp[3] = atos_sentence[0]+"がまいります";
        arrv_smp[4] = "";
        arrv_smp[6] = ""; 
      }
    break;

    default:
      null;
    break;
  }
}

// ATOS仕様の折返放送
let back_atos = [
  [""], //当駅止まり放送
  [""], //ドア・両数
  ["折り返し"], //折返
  [""], //時刻・路線・種別・愛称
  [""],//行先a,b
  ["行きと\nなります"], //行きと・なります
  [""] //簡易・増解結
]
function arriv_3(){
  // 当駅止放送
  arriv_2("5");
  back_atos[0] = "";
  for(d=0;d<=6;d++){
    back_atos[0] = back_atos[0] + '\n' + arrv_smp[d];
  }
  // 両数セット
  // ドア・両数
  if ($("#door_car").prop('checked') == true) {
    back_atos[1] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n"+ reconciliation(2)+"\n空白0.5秒";
  }else{
    back_atos[1] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n";
  }
  
  // 行先セット
  dest_yukiga();
  // 各種パーツセット
  back_atos[3] = atos_sentence[2];
  for(d=4;d<=7;d++){
    back_atos[3] = back_atos[3] + '\n' + atos_sentence[d];
  }
  // 増解結系
  back_atos[6] = "空白0.5秒\n"+reconciliation(1);
}

// 予告放送
let yokoku = [
  [""], //時間帯
  [""], //今度の
  [""], //番線
  [""], //停車中の
  [""], //res
  [""], //時刻・路線・種別・愛称・行先
  [""],
  [""], //ドア・両数
  [""], //発車待ち
  [""], //切り離し等
  [""] //付帯
]
function notice(){
  atos_mode = 1;
  list_link = [];
  playlist = [];
  $("#playlist_out").val("");
  // 元パーツセット
  sentence_set();
  
  if($('[name=mor_honj][value=0]').prop('checked')){
    yokoku[0] = "おはようございます\n空白0.5秒";
  }else{
    yokoku[0] = "本日も、ご利用いただき、ありがとうございます\n空白0.5秒";
  }
  // パーツ挿入
  yokoku[5] = atos_sentence[2];
  for(d=4;d<=8;d++){
    yokoku[5] = yokoku[5] + '\n' + atos_sentence[d];
  }
  //山手用選択時
  if($('[name=bound_set][value=3]').prop('checked')){
    yokoku[5] = yokoku[5] + '\n' + atos_sentence[9] + "\n方面\n行きです";
    //2行先時
  }else if($("[name=bound_set][value=2]").prop('checked')){
    yokoku[5] = yokoku[5] + '\n' + atos_sentence[9] + "\n行きです";
  }else{
    yokoku[5] = yokoku[5] + '\n' + "行きです";
  }
  // 増解結系
  
  yokoku[9] = reconciliation(0);

  // 付帯
  yokoku[10] = atos_sentence[16]

  // 到着前の予告放送
  if($('[name=type_3][value=0]').prop('checked')){
    yokoku[1] = "今度の";
    if(atos_sentence[1]!=''){
      yokoku[2] = atos_sentence[1]+"の";
    }else{
      yokoku[2] = "";
    }
    
    yokoku[3] = "";
    yokoku[4] = atos_sentence[0]+"は";

    // ドア・両数
    if ($("#door_car").prop('checked') == true) {
      yokoku[6] = "空白0.5秒\nこの"+atos_sentence[0]+"は";
      yokoku[7] = reconciliation(2);
    }else{
      yokoku[6] = "";
      yokoku[7] = "";
    }
    
    
    // 出発予告
  }else if($('[name=type_3][value=1]').prop('checked')){
    yokoku[1] = "";
    if(atos_sentence[1]!=''){
      yokoku[2] = atos_sentence[1]+"に";
    }else{
      yokoku[2] = "";
    }
    yokoku[3] = "停車中の";
    yokoku[4] = atos_sentence[0]+"は";
    yokoku[6] = "空白0.5秒\n発車まで";
    yokoku[7] = "しばらくお待ちください";
  }

  $("#playlist_out").val(yokoku.join('\n'));
}
// $("#playlist_out").val(.join('\n'));
let off_smp = [
  [""], //番線
  [""], //路線名
  ["ドアが閉まります"], //
  ["ご注意ください"] //
]
let off_4 = [
  [""], //
  [""], //路線・種別・愛称
  [""],//行先
  [""],//行先b
  [""], //行きが
  ["発車いたします"], //
  ["ドアが閉まります"], //
  ["ご注意ください"],
  [""]//付随
]
//戸閉放送;0:通常,1:路線名,2:種別,3:仙台式
function off_3(mode){
  atos_mode = 3;
  // 元パーツセット
  sentence_set();
  // let out_df = "";
  if(mode==0){
    off_smp[0] = atos_sentence[1];
    off_smp[1] = "";
    return off_smp;
  }else if(mode==1){
    if(atos_sentence[1]!=''){
      off_smp[0] = atos_sentence[1]+"の";
    }else{
      off_smp[0] = "";
    }
    off_smp[1] = atos_sentence[3];
    return off_smp;
  }else if(mode==2){
    if(atos_sentence[1]!=''){
      off_4[0] = atos_sentence[1]+"から";
    }else{
      off_4[0] = "";
    }
    if(atos_sentence[5] == "回送" || atos_sentence[5] == "団体" || atos_sentence[5] == "貨物"){
      off_4[1] = atos_sentence[5]+"列車が";
    }else{
      off_4[1] = atos_sentence[5]+"\n"+atos_sentence[0]+"が"
    }
    off_4[2] = "";
    off_4[3] = "";
    off_4[4] = "";
    off_4[6] = "";
    return off_4;
  }else if(mode==3){
    if(atos_sentence[1]!=''){
      off_4[0] = atos_sentence[1]+"から";
    }else{
      off_4[0] = "";
    }
    off_4[1] = "";
    for(d=4;d<=7;d++){
      off_4[1] = off_4[1] + '\n'+ atos_sentence[d];
    }
    // 行先
    dest_yukiga();
    off_4[2] = arrv[5];
    off_4[3] = arrv[6];
    off_4[4] = arrv[7];
    off_4[6] = "空白0.5秒\nドアが閉まります"
    off_4[8] = atos_sentence[16];
    return off_4;
  }
}

function sta_call(){
  list_link = [];
  playlist = [];
  $("#playlist_out").val("");
  soundnum = 0;
  let call_ind = [
    [""],
    ["空白0.5秒"],
    [""],
    ["空白0.5秒\n空白0.25秒"],
    ["ご乗車、ありがとうございます"]
  ]
  if($("#call_sta_manual").val() != ""){
    call_ind[0] = $("#call_sta_manual").val();
  }else{
    call_ind[0] = call_sta_v[$("#call_sta").val()][1];
  }
  call_ind[2] = call_ind[0];

  if ($("#call_sta_2").val() == 0){
    call_ind[4] = "ご乗車、ありがとうございます";
    $("#playlist_out").val(call_ind.join('\n'));
    check_sound();
  }else if($("#call_sta_2").val() == 1){
    call_ind[4] = "終着放送";
    $("#playlist_out").val(call_ind.join('\n'));
    check_sound();
  }else{
    $("#playlist_out").val("禁煙放送");
    check_sound();
  }
  
}


function dest_yukiga(){
  // 2つ(行き分け)
  if($("[name=bound_set][value=2]").prop('checked')){
    arrv[5] = atos_sentence[8];
    arrv[6] = atos_sentence[9];
    arrv[7] = "行きが";

    back_atos[4] = atos_sentence[8] + "\n" + atos_sentence[9];
  // 単独(非連続)
  }else if($("[name=bound_set][value=1]").prop('checked')){
    arrv[5] = atos_sentence[8];
    arrv[6] = "";
    arrv[7] = "行きが";
    
    back_atos[4] = atos_sentence[8];
    // 山手用
  }else if($('[name=bound_set][value=3]').prop('checked')){
    arrv[5] = atos_sentence[8];

    for(d=0;d<bound_ga.length;d++){
      if(atos_sentence[9] + "方面行きが" === bound_ga[d][1]){
        arrv[6] = bound_ga[d][1];
        arrv[7] = "";
        break;
      }else if(d === (bound_ga.length-1) && atos_sentence[9] + "方面行きが" != bound_ga[d][1]){
        arrv[6] = atos_sentence[9];/*bound_ga[d][1]*/
        arrv[7] = "方面行きが";
      }
    }
    back_atos[4] = atos_sentence[8] + '\n' + atos_sentence[9] + "\n方面";
    // 単独(連続)
  }else if($('[name=bound_set][value=0]').prop('checked')){
    arrv[5] = atos_sentence[8];
    arrv[6] = "";
    for(d=0;d<bound_ga.length;d++){
      if(atos_sentence[8] + "行きが" === bound_ga[d][1]){
        arrv[5] = bound_ga[d][1];
        arrv[7] = "";
        break;
      }else if(d === (bound_ga.length-1) && atos_sentence[8] + "行きが" != bound_ga[d][1]){
        arrv[5] = atos_sentence[8];
        arrv[7] = "行きが";
      }
    }
    back_atos[4] = atos_sentence[8];
  }
}

// 増解結・処理 0:通常, 1:折返(簡易仕様), 2:両数
function reconciliation(mode){
  let add_et = "";
  if (mode ==0) {
      if(atos_sentence[12]=="なし"){
        add_et = "";
      }else if(atos_sentence[12]=="増結"){
        add_et = "空白0.5秒\n"+atos_sentence[15]+"\n"+atos_sentence[13]+"\n"+atos_sentence[14]+"\n増結をいたします";
      }else{
        add_et = "空白0.5秒\nこの"+atos_sentence[0]+"の\n"+atos_sentence[13]+
        '\n'+atos_sentence[14]+'は\n'+atos_sentence[15]+
        "\n止まりとなります";
      }
      // 折返:増結系
  }else if(mode == 1){
    if(atos_sentence[12]=="なし"){
      add_et = "";
    }else if(atos_sentence[12]=="増結"){
      add_et = "当駅で"+"\n増結をいたします";
    }else{
      add_et = "当駅で\n切り離しを行います"
    }
    // 両数
  }else if(mode == 2){
    for(d=1;d<cars.length;d++){
      // 両数連続パーツ有時
      if(atos_sentence[11]+"です" === cars[d][1]){
        add_et = atos_sentence[10] + '\n' + cars[d][1];
        break;
        // 無し
      }else if(d === (cars.length-1) && atos_sentence[11]+"です" != cars[d][1]){
        add_et = atos_sentence[10] + '\n' + atos_sentence[11]+"\nです";
      }
    }
    if($("#green_car").prop('checked') == true){
      add_et = add_et + "\n空白0.5秒\nグリーン車がついております";
    }
  }
  return add_et;
}


$('#arriv').on('click', function(){
  arriv();
});
$("#info").on('click', function(){
  notice();
})