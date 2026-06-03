(function () {
  "use strict";

  const surveillanceCats = [
    {
      id: 1,
      name: "ミケ",
      title: "休日の猫動画耐性を確認",
      description: "休憩中を装いながら、対象者のスクロール継続時間を密かに観測しています。",
      tag: "お昼寝確認",
      date: "2026.05.28",
      rating: 4,
      image: "assets/images/reports/cat01.jpg"
    },
    {
      id: 2,
      name: "クロ",
      title: "在宅ワークの集中力を観測中",
      description: "机上への接近頻度が高く、キーボード周辺での任務介入が予測されます。",
      tag: "机上監視中",
      date: "2026.05.27",
      rating: 3,
      image: "assets/images/reports/cat02.jpg"
    },
    {
      id: 3,
      name: "トラ",
      title: "窓辺滞在時間の分析",
      description: "窓辺の定位置を確保し、夜景と帰宅予定者を同時に監視しています。",
      tag: "窓辺準備中",
      date: "2026.05.26",
      rating: 5,
      image: "assets/images/reports/cat03.jpg"
    },
    {
      id: 4,
      name: "シロ",
      title: "屋上での視線誘導を確認",
      description: "高所からの視線に気づきやすく、猫の存在検知能力が安定しています。",
      tag: "屋上待機中",
      date: "2026.05.25",
      rating: 4,
      image: "assets/images/reports/cat04.jpg"
    },
    {
      id: 5,
      name: "ハチ",
      title: "書斎での猫吸引傾向を記録",
      description: "資料、封筒、柔らかい椅子への反応から、配属候補としての素養を確認。",
      tag: "極秘記録更新",
      date: "2026.05.24",
      rating: 5,
      image: "assets/images/reports/cat05.jpg"
    },
    {
      id: 6,
      name: "ルナ",
      title: "ベランダ監視行動を分析",
      description: "外気確認時に猫の気配を探す傾向あり。NNN通信網との同期率が上昇中です。",
      tag: "監視網拡大中",
      date: "2026.05.23",
      rating: 4,
      image: "assets/images/reports/cat06.jpg"
    },
    {
      id: 7,
      name: "ココ",
      title: "ランプ下での反応を記録",
      description: "夜の作業中、灯りのそばに現れる猫への受容度が高いと判断されました。",
      tag: "極秘記録更新",
      date: "2026.05.22",
      rating: 4,
      image: "assets/images/reports/cat07.jpg"
    },
    {
      id: 8,
      name: "ノワール",
      title: "書類周辺での待機を確認",
      description: "機密資料の近くで静かに待機。猫印の承認手続きに強い関心を示しています。",
      tag: "見守り強化中",
      date: "2026.05.21",
      rating: 5,
      image: "assets/images/reports/cat08.jpg"
    },
    {
      id: 9,
      name: "モカ",
      title: "ランプ下での反応を記録",
      description: "夜の作業中、灯りのそばに現れる猫への受容度が高いと判断されました。",
      tag: "机上監視中",
      date: "2026.05.20",
      rating: 4,
      image: "assets/images/reports/cat09.jpg"
    },
    {
      id: 10,
      name: "ソラ",
      title: "屋上での視線誘導を確認",
      description: "高所からの視線に気づきやすく、猫の存在検知能力が安定しています。",
      tag: "屋上待機中",
      date: "2026.05.19",
      rating: 5,
      image: "assets/images/reports/cat10.jpg"
    },
    {
      id: 11,
      name: "チビ",
      title: "静かな部屋での気配感知",
      description: "雨音と窓辺の反射により、猫の監視を受けている感覚が増幅しています。",
      tag: "静音追尾中",
      date: "2026.05.18",
      rating: 3,
      image: "assets/images/reports/cat11.jpg"
    },
    {
      id: 12,
      name: "ナナ",
      title: "深夜閲覧中の猫親和性",
      description: "通信機器の光に誘導され、猫関連情報への到達速度が短縮されています。",
      tag: "ひそひそ通信中",
      date: "2026.05.17",
      rating: 4,
      image: "assets/images/reports/cat12.jpg"
    },
    {
      id: 13,
      name: "ユキ",
      title: "窓辺滞在時間の分析",
      description: "窓辺、ソファ、端末画面の三点を結ぶ猫観察導線が形成されています。",
      tag: "星図照合中",
      date: "2026.05.16",
      rating: 4,
      image: "assets/images/reports/cat13.jpg"
    },
    {
      id: 14,
      name: "ベル",
      title: "物音への耳反応を観測",
      description: "廊下の微細な気配に反応。猫の接近を期待する心理状態が確認されました。",
      tag: "夜食警戒中",
      date: "2026.05.15",
      rating: 3,
      image: "assets/images/reports/cat14.jpg"
    },
    {
      id: 15,
      name: "レオ",
      title: "猫モチーフ収集傾向を確認",
      description: "星図、月、黒猫モチーフへの注目が強く、内部資料適性が高いと判定。",
      tag: "配属候補観察中",
      date: "2026.05.14",
      rating: 5,
      image: "assets/images/reports/cat15.jpg"
    },
    {
      id: 16,
      name: "サブロウ",
      title: "内部資料への適性を調査",
      description: "機密書類風の画面に反応し、猫の任務印を受け取る準備が整いつつあります。",
      tag: "デスク侵入確認",
      date: "2026.05.13",
      rating: 4,
      image: "assets/images/reports/cat16.jpg"
    }
  ];

  const observationComments = [
    "今夜の観測記録を、猫の気分で4件だけ開示しています。",
    "すべての記録は極秘です。本日は猫の許可が出た4件のみ公開中。",
    "NNN監視網より、本日閲覧を許された記録だけを表示しています。",
    "表示される報告は、担当猫の気分により毎回変わります。",
    "今回の開示分です。残りの記録は、猫が上に乗っているため閲覧できません。"
  ];

  const reportFooterComments = [
    "本報告書の内容は極秘です。猫に読まれた場合、すべてなかったことになります。",
    "観測記録は猫の気分により改ざんされる場合があります。あらかじめご了承ください。",
    "本報告書はNNN内部資料です。内容を猫に見せると、なぜか目をそらされます。",
    "すべての報告は猫の気分と月の満ち欠けにより変動します。",
    "本日の観測はここまでです。なお、背後の気配については各自でご確認ください。",
    "この報告書を閉じたあと、猫が何事もなかった顔をしていた場合は正常です。",
    "記録の一部は、猫がキーボードの上を歩いたため判読不能です。",
    "NNNは本件について沈黙しています。猫も同じく沈黙しています。"
  ];

  function getRandomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function getRandomCats(data, count) {
    const copied = data.slice();

    for (let index = copied.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      const temporary = copied[index];
      copied[index] = copied[randomIndex];
      copied[randomIndex] = temporary;
    }

    return copied.slice(0, count);
  }

  function createStarRating(rating) {
    return Array.from({ length: 5 }, function (_, index) {
      return index < rating ? "★" : "☆";
    }).join("");
  }

  function renderSurveillanceCards(items) {
    const grid = document.getElementById("surveillanceGrid");

    if (!grid) {
      return;
    }

    grid.innerHTML = items.map(function (cat) {
      return (
        '<article class="surveillance-card">' +
          '<div class="surveillance-image">' +
            '<img src="' + cat.image + '" alt="' + cat.title + ' - 監視官' + cat.name + '" loading="lazy">' +
            '<span class="surveillance-tag">' + cat.tag + "</span>" +
          "</div>" +
          '<div class="surveillance-body">' +
            "<h3>" + cat.title + "</h3>" +
            "<p>" + cat.description + "</p>" +
            '<dl class="surveillance-meta">' +
              "<div><dt>日付</dt><dd>" + cat.date + "</dd></div>" +
              "<div><dt>監視官</dt><dd>" + cat.name + "</dd></div>" +
              '<div><dt>評価</dt><dd class="surveillance-stars" aria-label="5段階中' + cat.rating + '"> ' + createStarRating(cat.rating) + "</dd></div>" +
            "</dl>" +
          "</div>" +
        "</article>"
      );
    }).join("");
  }

  function renderObservationComment() {
    const commentEl = document.getElementById("observationComment");

    if (!commentEl) {
      return;
    }

    commentEl.textContent = getRandomItem(observationComments);
  }

  function renderReportFooterComment() {
    const footerCommentEl = document.getElementById("reportFooterComment");

    if (!footerCommentEl) {
      return;
    }

    footerCommentEl.textContent = getRandomItem(reportFooterComments);
  }

  renderObservationComment();
  renderReportFooterComment();
  renderSurveillanceCards(getRandomCats(surveillanceCats, 4));
})();
