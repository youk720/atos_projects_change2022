
let atos_mode = 0;
// 接近用:準詳細
let arrv = [
  ["接近メロディ\n空白0.5秒"], //
  ["まもなく"],
  [""], //番線
  [""], //始発
  [""], //放送生成文
  ["まいります\n空白0.5秒"], //まいります・到着します
  ["危ないですから、黄色い線まで、お下がりください"], //危険線:他
  [""], //ドア・両数
  [""], //切り離し等
  [""],
  [""] //付帯
]

function arriv(){
  // 接近放送モード
  atos_mode = 2;
  // 放送文初期化
  list_link = [];
  playlist = [];
  $("#playlist_out").val("");

  // 元パーツセット
  atos_set(tee[tee_count][11].split(':')[0]);

  // 危険線:洗濯
  arrv[6] = atos_cross[$("#seafty").val()][1];
  arrv_smp[5] = atos_cross[$("#seafty").val()][1];

  // 放送種別選定:通常,当駅始発
  if(tee[tee_count][2] <= 2){
    arriv_1(tee[tee_count][2]);
    $("#playlist_out").val(arrv.join('\n'));
    // 折返
  }else if(tee[tee_count][2] == 3){
    arriv_3(/*$("#type_2").val()*/);
    $("#playlist_out").val(back_atos.join('\n'));
    // その他簡易
  }else{
    arriv_2(tee[tee_count][2]);
    $("#playlist_out").val(arrv_smp.join('\n'));
  }
}
// 通常(後続), 当駅始発
function arriv_1(mode){

  if(atos_sentence[1]!=''){
    arrv[2] = atos_sentence[1]+"に";
  }else{
    arrv[2] = "";
  }
  if(mode == 2){
    arrv[3] = "当駅始発";
  }else{
    arrv[3] = "";
  }
  // 各種放送
  arrv[4] = destination(1, tee[tee_count][11].split(':')[0]);
  // ドア数案内
  arrv[7] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n" + reconciliation(2, tee[tee_count][11]);
  // 増解結系
  arrv[8] = reconciliation(0, tee[tee_count][11]);
  // 後続退避
  if(tee[tee_count][2]=="1"){
    arrv[9] = subseq(tee[tee_count+1][2]);
  }else{
    arrv[9] = "";
  }
  // 付帯
  arrv[10] = "";
  for(d=0;d<tee[tee_count][22].split('\\n').length;d++){
    arrv[10] = arrv[10] + '\n' + tee[tee_count][22].split('\\n')[d];
  }

}

// 簡易接近
let arrv_smp = [
  ["接近メロディ"], //
  ["まもなく"],
  [""], //番線
  [""], //
  [""], //
  ["危ないですから、黄色い線まで、お下がりください"], //危険線:他
  [""] //
]
// 簡易放送
function arriv_2(mode){
  switch (mode) {
    // 簡易
    case "4":
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
    case "6":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"を";
      }else{
        arrv_smp[2] = "";
      }
      if(atos_sentence[0] == "列車"){
        if(/*atos_sentence[4] == "回送" || atos_sentence[4] == "団体" || */atos_sentence[4] == "貨物"){
          arrv_smp[3] = atos_sentence[4]+"列車が";
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
    case "7":
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
    case "5":
      if(atos_sentence[1]!=''){
        arrv_smp[2] = atos_sentence[1]+"に";
      }else{
        arrv_smp[2] = "";
      }
      if(atos_sentence[0] == "列車"){
        if(atos_sentence[4] == "回送" || atos_sentence[4] == "団体" || atos_sentence[4] == "貨物"){
          arrv_smp[3] = atos_sentence[4]+"列車が";
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
  [""], //各種情報生成
  ["行きと\nなります"], //行きと・なります
  [""] //簡易・増解結
]
// 折り返し
function arriv_3(){
  // 当駅止放送
  arriv_2("7");
  back_atos[0] = "";
  for(d=0;d<=6;d++){
    back_atos[0] = back_atos[0] + '\n' + arrv_smp[d];
  }
  // 両数セット
  // ドア・両数
  if (atos_sentence[8]!="") {
    back_atos[1] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n"+ reconciliation(2, tee[tee_count][11])+"\n空白0.5秒";
  }else{
    back_atos[1] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n";
  }

  // 各種放送投入
  back_atos[3] = destination(0, tee[tee_count][11].split(':')[0]);
  // 増解結
  back_atos[5] = reconciliation(1, tee[tee_count][11]);
}

// 予告放送
let yokoku = [
  ["本日も、ご利用いただき、ありがとうございます\n空白0.5秒"], //時間帯
  [""], //今度の
  [""], //番線
  [""], //停車中の
  [""], //res
  [""], //時刻・路線・種別・愛称・行先A
  ["行きです"],
  [""], //ドア・両数
  [""], //発車待ち
  [""], //切り離し等
  [""],
  [""] //付帯
]
function notice(){
  atos_mode = 1;
  list_link = [];
  playlist = [];
  $("#playlist_out").val("");

  if($('[name=mor_honj][value=0]').prop('checked')){
    yokoku[0] = "おはようございます\n空白0.5秒";
  }else{
    yokoku[0] = "本日も、ご利用いただき、ありがとうございます\n空白0.5秒";
  }

  // 元パーツセット
  atos_set(tee[tee_count][11].split(':')[0]);

  // res den
  yokoku[4] = atos_sentence[0]+"は";
  // 各種パーツ
  yokoku[5] = destination(0, tee[tee_count][11].split(':')[0]);
  // 付帯
  yokoku[11] = "";
  for(d=0;d<tee[tee_count][21].split('\\n').length;d++){
    yokoku[11] = yokoku[11] + '\n' + tee[tee_count][21].split('\\n')[d];
  }
  
   // 到着前の予告放送
  if($('[name=type_3][value=0]').prop('checked')){
    yokoku[1] = "今度の";
    if(atos_sentence[1]!=''){
      yokoku[2] = atos_sentence[1]+"の";
    }else{
      yokoku[2] = "";
    }
    yokoku[3] = "";
    // ドア両
    yokoku[7] = "空白0.5秒\nこの"+atos_sentence[0]+"は\n"+ reconciliation(2, tee[tee_count][11])+"\n空白0.5秒";
    yokoku[8] = "";
    // 増解結
    yokoku[9] = reconciliation(0, tee[tee_count][11]);
    // 後続案内
    if(tee[tee_count][2]=="1"){
      yokoku[10] = subseq(tee[tee_count+1][2]);
    }else{
      yokoku[10] = "";
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
    yokoku[7] = "空白0.5秒";
    yokoku[8] = "発車まで";
    yokoku[9] = "しばらくお待ちください"; 
  }
  $("#playlist_out").val(yokoku.join('\n'));
}

// 戸閉放送
let off_smp = [
  [""], //番線
  [""], //路線名
  ["ドアが閉まります"], //
  ["ご注意ください"], //
  [""]
]

let off_4 = [
  [""], //
  [""], //路線
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
  atos_set(tee[tee_count][11].split(':')[0]);

  // 付帯
  off_smp[4] = "";
  off_4[6] = "";
  if(tee[tee_count][23].split('\\n').length != 1 && tee[tee_count][23].split('\\n')[0] == '1'){
    for(d=0;d<tee[tee_count][23].split('\\n').length;d++){
    off_smp[4] = off_smp[4] + '\n' + tee[tee_count][23].split('\\n')[d];
    off_4[6] = off_4[6] + '\n' + tee[tee_count][23].split('\\n')[d];
    }
  }
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
    off_smp[1] = tee[tee_count][3];
    return off_smp;
  }else if(mode==2){
    if(atos_sentence[1]!=''){
      off_4[0] = atos_sentence[1]+"から";
    }else{
      off_4[0] = "";
    }
    if(atos_sentence[4] == "回送" || atos_sentence[4] == "団体" || atos_sentence[4] == "貨物"){
      off_4[1] = atos_sentence[4]+"列車が";
    }else{
      off_4[1] = atos_sentence[4]+"\n"+atos_sentence[0]+"が"
    }
    off_4[2] = "";
    off_4[4] = "";
    return off_4;
  }else if(mode==3){
    if(atos_sentence[1]!=''){
      off_4[0] = atos_sentence[1]+"から";
    }else{
      off_4[0] = "";
    }
    off_4[1] = destination(1, tee[tee_count][11].split(':')[0])
    off_4[2] = "";
    off_4[4] = "空白0.5秒\nドアが閉まります";
    // off_4[6] = atos_sentence[16];
    return off_4;
  }
}
// 駅名連呼 & 禁煙放送
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
    // 付帯
    if(tee[tee_count][23].split('\\n').length != 1){
      for(d=0;d<tee[tee_count][23].split('\\n').length;d++){
      call_ind[4] = call_ind[4] + '\n' + tee[tee_count][23].split('\\n')[d];
      }
    }
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


// 行先セット mode=予告・接近発車, mode_1=単独, 2列車
function destination(mode, mode_1){
  let result = "";
  // 単独列車用
  if(mode_1<=2){
    
    // 行先設定
    // 予告・折返用
    if(mode==0){
      // 各種パーツ追加
    for(d=2;d<=7;d++){
      result = result + "\n" + atos_sentence[d];
    }
    // 接近・発車用
    }else{
      // 各種パーツ追加
      for(d=3;d<=6;d++){
        result = result + "\n" + atos_sentence[d];
      }
      for(d=0;d<bound_ga.length;d++){
        if(atos_sentence[7] + "行きが" === bound_ga[d][1]){
          result = result + "\n" + bound_ga[d][1];
          break;
        }else if(d === (bound_ga.length-1) && atos_sentence[7] + "行きが" != bound_ga[d][1]){
          result = result + "\n" + atos_sentence[7] + "\n" + "行きが";
        }
      }
    }
    // 複数用
  }else{
    
    // 行先A以降設定
    // 予告・折返用
    if(mode==0){
      // 時刻・行先Aセット
      // 各種パーツ追加
      for(d=2;d<=7;d++){
        result = result + "\n" + atos_sentence[d];
      }
      result = result + "\n行き\n";
      // 列車Bセット
      for(d=9;d<=14;d++){
        result = result + "\n" + atos_sentence[d];
      }
      // 接近・発車用
    }else{
      // 各種パーツ追加
      for(d=3;d<=7;d++){
        result = result + "\n" + atos_sentence[d];
      }
      result = result + "\n行き\n";
      // 列車Bセット
      for(d=10;d<=13;d++){
        result = result + "\n" + atos_sentence[d];
      }
      result = result + "\n" + atos_sentence[14] + "\n" + "行きが";
     }
  }
  return result;
}

// /*  // 増解結・処理 0:通常, 1:折返(簡易仕様), 2:両数
function reconciliation(mode, aded){
  let add_et = "";
  if (mode ==0) {
      if(aded.split(':')[0]=="0"){
        add_et = "";
      }else if(aded.split(':')[0]=="1"){
        if(atos_sentence[14] == "当駅"){
          add_et = "空白0.5秒\n"+atos_sentence[14]+"で\n"+aded.split(":")[1]+"\n"+atos_sentence[16]+"両\n増結をいたします";
        }else{
          add_et = "空白0.5秒\n"+atos_sentence[14]+"\nで\n"+aded.split(":")[1]+"\n"+atos_sentence[16]+"両\n増結をいたします";
        }
      }else if(aded.split(':')[0]=="2"){
        add_et = "空白0.5秒\nこの"+atos_sentence[0]+"の\n"+aded.split(":")[1]+
        '\n'+atos_sentence[16]+'両は\n'+atos_sentence[14]+
        "\n止まりとなります";
      }
      // 折返:増結系
  }else if(mode == 1){
    if(aded=="0"){
      add_et = "";
    }else if(aded.split(':')[0]=="1"){
      add_et = "空白0.5秒\n当駅で"+"\n増結をいたします";
    }else if(aded.split(':')[0]=="2"){
      add_et = "空白0.5秒\n当駅で\n切り離しを行います"
    }
    // 両数
  }else if(mode == 2){
    // 単独時
    if(aded.split(':')[0]<=2){
      if(atos_sentence[8] != ""){
        for(d=1;d<cars.length;d++){
          // 両数連続パーツ有時
          if(atos_sentence[8]+"両です" === cars[d][1]){
            add_et = atos_sentence[15] + '\n' + cars[d][1];
            break;
            // 無し
          }else if(d === (cars.length-1) && atos_sentence[8]+"両です" != cars[d][1]){
            add_et = atos_sentence[15] + '\n' + atos_sentence[8]+"両\nです";
          }
        }
      }else{
        add_et = "";
      }  
      // 2列車時
    }else if(aded.split(':')[0]>=4){
      for(d=1;d<cars.length;d++){
        // 両数連続パーツ有時
        if(Number(atos_sentence[8]) + Number(atos_sentence[16])+"両です" === cars[d][1]){
          add_et = atos_sentence[15] + '\n' + cars[d][1];
          break;
        }
      }
    }
    // グリーン車案内
    if(tee[tee_count][9].split(':')[1] == "G"){
      add_et = add_et + "\n空白0.5秒\nグリーン車がついております";
    }
  }
  return add_et;
}
// */
// 後続列車案内:code=退避, mode=後続の接近種別
function subseq(mode){
  let result = "";
  // 退避列車
    result = "空白0.5秒\n当駅で\n";
    // 通過待ち
    if(mode==6){
      result = result + tee[tee_count+1][5] + "\n" + atos_sentence[0] + "\n通過待ちをいたします";
      // 待ち合わせ(後続列車は種別以下の放送のみ)
    }else{
      for(d=5;d<=8;d++){
        // 号数案内のみ
        if(d==7){
          result = result + gosu(tee[tee_count+1][7]);
        }else{
          result = result + "\n" +tee[tee_count+1][d];
        }
      }
      result = result + "\n行きの\n待ち合わせをいたします";
    }
    return result;
}

$('#arriv').on('click', function(){
  arriv();
});
$("#info").on('click', function(){
  notice();
});