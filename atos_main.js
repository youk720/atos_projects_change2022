'use strict';

// 音声定義
let atos1 = new Audio();
let atos2 = new Audio();
// let atos_noiz = new Audio("./sound/voicetext/noiz.mp3");
// let arriv_melo = new Audio("./sound/voicetext/接近メロディ_4.mp3");
// atos_noiz.volume = 0.5;
let atos_volume = 1;

// textareaサイズ初期設定
$("#playlist_out").width(321);
$("#playlist_out").height(196);

// テキストボックス入力値代入
let playlist = [];
// チェック後,URL貼り付け用
let list_link = [];

// 再生順変わった場合の処理(手動入力による変更)
$("#playlist_out").change(function(){
  list_link = [];
  playlist = [];
})

// 全パーツからクリックで入力される処理
function add_playlist(){
  let old_val = $("#playlist_out").val();
  $("#playlist_out").val(old_val +$("#all_parts option:selected").text()+'\n')
}

// 音源が実際に存在するかどうか、確認
function check_sound(){
  console.log("atos_mode:"+atos_mode);
  
  // すでにチェックが済んでいる場合、直接再生させる
  if (list_link.length != 0) {
    console.log("clear");

  // 音源チェック
  }else{
    $("#playlist_out").val($("#playlist_out").val()+"\n空白0.25秒");
    // 再生リストを入れる
    playlist = $("#playlist_out").val().split('\n');
    // チェック審査用フラグ
    let check_flag = false;
    let check_flag_2 = true;
    let out_sound = [];
    // プレイリスト内でチェック
    for (let i = 0; i < playlist.length; i++) {
      // atosの音源管理リストから、一致する音源を探す
      for (let t = 0; t < atos.length; t++) {
        // atosリストと、再生リストが一致の場合
        if (playlist[i] === atos[t][1]) {
          check_flag = true;
          // チェック後の再生リストへ、音源用リンクを貼る
          list_link.push(atos[t][0]);
          break;
        }else if(playlist[i] === ""){
          check_flag = true;
          break;
        }
      // console.log(list_link[i]);
      }
      // 音源が該当しなければ
      if (check_flag === false) {
        out_sound.push(playlist[i]);
      }
    }
    // フラグ審査
    if (out_sound.length != 0) {
      console.log("定義されていない音源があります\n"+ out_sound + "は、音源管理ファイルにありません");
      // 完了後,時間をおいて再生開始
    }else{
      console.log("clear");
    }
    console.log(list_link);
  }
  setTimeout(sound_start, 1000)
}

// 再生順番、初期定義
let soundnum = 0;
// atos終了定義
let over = false;

// 音声再生枠
function sound_start(){
  over = false;
  // 再現ノイズ
  // atos_noiz.play();
  // atos_noiz.loop = true;
  
  // 最初の時の処理
   if (soundnum === 0) {
    stop_atos();
    //  リンク定義
    atos1 = new Audio(list_link[soundnum]);
    atos1.play();
    console.log("src1: " + list_link[soundnum]);
    atos1.volume = atos_volume;
    // 偶数順番
  }else if (soundnum % 2 === 0) {
    atos1.play();
    atos1.volume = atos_volume;
    // 奇数順番
  }else{
    atos2.play();
    atos2.volume = atos_volume;
  }
  // 順番の数字が、チェック済みの再生パーツ数より多くなるまで
  if(soundnum < list_link.length-1){
    console.log(soundnum);
    // 奇数順番時
    if(soundnum % 2 === 1){
      // 音源再生終了後、リンク定義&順番を進める
      $(atos2).on('ended', function(){
        soundnum++;
        console.log("src1: " + list_link[soundnum]);
        atos1 = new Audio(list_link[soundnum]);
        // console.log("src1: " + atos1.src);
        
        // 次の音源を再生させる
        nextsound();
      });
      // 偶数順番時
    }else{
      $(atos1).on('ended', function(){
        soundnum++;
        console.log("src2: " + list_link[soundnum]);
        atos2 = new Audio(list_link[soundnum]);
        // console.log("src2: " + atos2.src);
        nextsound();
     });
    }
    // 接近メロディ再生用ループ設置
   }else{
    //  if (atos_mode == 2) {
    //   setTimeout(function(){
    //     arriv_melo.currentTime = 0;
    //     arriv_melo.play();
    //     arriv_melo.loop = true;
    //   }, 5000);
    //  }

     if(list_link.length % 2 === 1){
      setTimeout(function(){
        // atos_noiz.loop = false;
        // atos_noiz.currentTime = 0;
        // atos_noiz.pause();
        console.log("over");
        // /*デバック用無効
        atos_mode = 0;
        console.log("atos_mode: " + atos_mode);

        if (atos_mode == 2) {
          // arriv_melo.currentTime = 0;
          // arriv_melo.play();
          // arriv_melo.loop = true;
        }
        // */
      }, (atos2.duration * 1000));
     }else{
       setTimeout(function(){
        // atos_noiz.loop = false;
        // atos_noiz.currentTime = 0;
        // atos_noiz.pause();
        console.log("over");
        // /*デバック用無効
        atos_mode = 0;
        console.log("atos_mode: " + atos_mode);

        if (atos_mode == 2) {
          // arriv_melo.currentTime = 0;
          // arriv_melo.play();
          // arriv_melo.loop = true;
        }
        // */
       }, (atos1.duration * 1000));
     }
     over = true;
     
   }
}

// 次音源再生開始用の関数処理
function nextsound() {
  sound_start();
}
// クリア操作
$("#clear").on('click', function(){
  playlist = []
  list_link = []
  $("#playlist_out").val("");
  
});

// ATOS起動
$('#atos_start').on('click', function(){
  soundnum = 0;
  check_sound();
})

function stop_atos(){
  atos1.loop = false;
  atos1.pause();
  atos2.loop = false;
  atos2.pause();
  // arriv_melo.pause();
  // arriv_melo.loop = false;
  // atos_noiz.loop = false;
  // atos_noiz.currentTime = 0;
  // atos_noiz.pause();
}

// 途中停止処理
$("#atos_stop").on('click', function(){
  stop_atos();
})