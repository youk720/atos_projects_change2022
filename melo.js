'use strict';

// 初期定義
let melo = new Audio("");
let melo_noiz = new Audio("./noiz_melo.mp3");
melo_noiz.volume = 0.13;

// メロディ(セレクトタブからの選曲時の処理)
$("#melo_select").change(function(){
  melo.src = $("#melo_select").val();
  console.log("now melody: " + melo.src);
});

// メロディ&ドア閉処理(手動入力時の処理)
$('#custam_sw').on('click', function(){
  // 手動入力のところが未入力の時の処理
  if ($("#melo_input").val() != "") {
    // セレクトタブで選択されているものを入れる
    melo.src = $("#melo_input").val();
  }else{
    // 手動入力されたものを入れる
    melo.src = $("#melo_select").val();
  }
  // リンク切り替えのデバッグ処理
  // console.log("now melody: " + melo.src);
});

// リンク部削除
$("#melo_url_del").on('click', function(){
  $("#melo_input").val("");
})

melo.volume = 0.5; //ボリューム初期設定値
// door.volume = 0.5; //ボリューム初期設定値
//ボリューム数値,元値を100倍して出力
$("#mv_value").html("メロディ用ボリューム" + " 現在:" + Math.floor(melo.volume * 100));
// ボリューム数値,元値を100倍して出力
$("#smoking_value").html("禁煙音源ボリューム" + " 現在:" + Math.floor(atos_volume * 100));

// off操作時の禁煙放送停止して、ドア閉め放送再生する処理の関数を定義。
function off_1(){
  // off操作時の禁煙放送停止

  if (atos_mode != 2) {
    atos1.pause();
    atos2.pause();
    list_link = [];
    playlist = [];
    $("#playlist_out").val("");
  // ドア閉放送種別変更
    // ○番線
  if($('[name=atos_door][value=0]').prop('checked')){
    $("#playlist_out").val(off_3(0).join('\n'));

    // ○番線 路線愛称 路線名
  }else if($('[name=atos_door][value=2]').prop('checked')){
    $("#playlist_out").val(off_3(1).join('\n'));

    // ○番線から "種別" が 発車いたします
  }else if($('[name=atos_door][value=3]').prop('checked')){
    $("#playlist_out").val(off_3(2).join('\n'));

    // 仙台式:房総成田
  }else if($('[name=atos_door][value=4]').prop('checked')){
    $("#playlist_out").val(off_3(3).join('\n'));
    // 房総型
  }else if($('[name=atos_door][value=1]').prop('checked')){
    $("#playlist_out").val(off_3(4).join('\n'));
  }
    soundnum = 0;
    check_sound();
    atos_mode = 3;
  }
}


// on操作時の処理を関数定義
function on(){
  $(function(){
    
    melo.play();
    melo.loop = true;
    console.log("melody's loop is " + melo.loop);
    if($("#noiz_check").prop('checked')){
      melo_noiz.play()
      melo_noiz.loop = true;
    }
  })
}

//off関数を新たに定義しました。しとかないとoffクリックしたり,dキークリックした時の処理文が長くなってめんどくなる
function off(){
    //以下は通常モードの処理
    if($('[name=sw_mode][value=0]').prop('checked')){
    melo.pause();
    melo.currentTime = 0;
    melo.loop = false;
    melo_noiz.pause();
    melo_noiz.currentTime = 0;
    melo_noiz.loop = false;
    if($('[name=on_mode][value=1]').prop('checked')){
        atos_volume_change();
      }
    setTimeout(off_1, 1780);

    console.log("melody's loop is " + melo.loop);
    }
    //以下は立川モードの処理
    else if($('[name=sw_mode][value=1]').prop('checked')){
      melo.loop = false;
      if($('[name=on_mode][value=1]').prop('checked')){
        atos_volume_change();
      }
      
      setTimeout(off_1, 1780);
      // door.play();
      console.log("melody's loop is " + melo.loop);
    }
    // 別モード
    else if($('[name=sw_mode][value=2]').prop('checked')){
      melo.loop = false;
      console.log("melody's loop is " + melo.loop);
    }
  // $("#on").removeClass().addClass("btn btn-danger btn-lg  text-center");
}

// メロディが流れ終わってからの処理
$(melo).on("ended", function(){
    melo_noiz.pause();
    melo_noiz.currentTime = 0;
    melo_noiz.loop = false;
    atos_volume_change();
    
  if ($('[name=sw_mode][value=2]').prop('checked')) {
    setTimeout(off_1, 1500);
  }
});

//戸閉放送流れてる時にonを押したら止める処理の関数定義
function on_door(){
    if($('[name=on_mode][value=0]').prop('checked')){
      return;
    };
    if($('[name=on_mode][value=1]').prop('checked')){
      // 禁煙放送強制停止
      // stop_atos();
      atos1.volume = 0;
      atos2.volume = 0;
      atos_volume = 0;
    }
}

// メロディの再生時間と、合計時間表示
function time(){
  $(function (){
    setInterval(function(){
      let m = ('0' + Math.floor( melo.currentTime / 60 )) .slice( -2 );
      let s = ( '0' + Math.floor( melo.currentTime % 60 )) .slice( -2 );
      let dm = ( '0' + Math.floor( melo.duration / 60 ) ) .slice( -2 );
      let ds = ( '0' + Math.floor( melo.duration % 60 ) ) .slice( -2 );
      $("#time").html(m + ":" + s + " / " + dm + ":" + ds);

    }, 100);
  });
}

time();



$('#smoking').on('click', function(f){
  smoking();
});
$('#on').on('click', function(f) {
  //on関数召喚
  on();
  on_door()
});
$('#off').on('click', function (){
  //off関数召喚
    off();
});

// キーボード各種操作
$('body').on('keydown', function(m){
  // off操作時
  if(m.keyCode === 68){
    //68 = dキー
    off();
    // on操作
  }else if(m.keyCode === 69) {
    //69キー=Eキー
    on();
    on_door();
    // 禁煙放送操作時
  }else if(m.keyCode === 88){
    // 88 = xキー
    sta_call();
    // ATOS起動
  }else if(m.keyCode === 71){
    // 71 = Gキー
    soundnum = 0;
    check_sound();
    // ATOS停止
  }else if(m.keyCode === 83){
    // 83 = sキー
    stop_atos();
    // result_output();
    // 接近
  }else if(m.keyCode === 82){
    // 82 = Rキー
    arriv();
    // 予告
  }else if(m.keyCode === 87){
    // W = 87
    notice();
    // <キー
  }else if(m.keyCode == 188){
    up();
    // >キー
  }else if(m.keyCode == 190){
    down();
  }
})

// ボタン押した時
$("#first_off").mousedown(function(){
  on();
});

// ボタン離した瞬間　
$("#first_off").mouseup(function(){
  melo.loop = false;
  setTimeout(() => {
    off_1();
  }, 10000);
})


//メロディ音源ボリューム制御
let volume = $("#melo_volume");
$(volume).change(function() {

  let volumeValue = (volume.val().length == 1) ? '0.0' + volume.val() : '0.' + volume.val();

    if (volumeValue === "0.100") {
        melo.volume = 1;
        $("#mv_value").html("メロディ用ボリューム" + " 現在:" + 100);//ボリューム数値,元値を100倍して出力
    }else{
      melo.volume = volumeValue;
      $("#mv_value").html("メロディ用ボリューム" + " 現在:" + (volumeValue * 1000)/ 10);//ボリューム数値,元値を100倍して出力
    }
    melo_noiz.volume =volumeValue*0.3;
  // $(volume).val(volumeValue);
});
// ATOS放送ボリューム制御
// let volume_smoking = $("#smoking_volume");
$($("#smoking_volume")).change(function(){
  atos_volume_change();
});

function atos_volume_change(){
  let volumeValue = ($("#smoking_volume").val().length === 1) ? '0.0' + $("#smoking_volume").val() : '0.' + $("#smoking_volume").val();
  if(volumeValue === "0.100"){
    atos1.volume = 1;
    atos2.volume = 1;
    atos_volume = 1;
    $("#smoking_value").html("禁煙音源ボリューム" + " 現在:" + 100);
  }else{
    $("#smoking_value").html("禁煙音源ボリューム" + " 現在:" + ((volumeValue) * 1000)/10);
    //ボリューム数値,元値を100倍して出力
    atos_volume = volumeValue;
    atos1.volume = volumeValue;
    atos2.volume = volumeValue;
  }
}