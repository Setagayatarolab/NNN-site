(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = siteNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  var reportImage = document.getElementById("reportImage");
  var reportBadge = document.getElementById("reportBadge");
  var reportTitle = document.getElementById("reportTitle");
  var reportDescription = document.getElementById("reportDescription");
  var reportScore = document.getElementById("reportScore");
  var reportStatus = document.getElementById("reportStatus");
  var reportOfficer = document.getElementById("reportOfficer");
  var reportTotal = document.getElementById("reportTotal");

  var reportPatterns = [
    {
      image: "images/reports/report-cat-01.webp",
      badge: "深夜パトロール中",
      title: "夜間巡回ログを検出",
      description: "午前0時を過ぎた窓辺にて、対象猫が静かに周辺監視を実施。人間側の猫動画視聴傾向にも反応を示しています。",
      score: "🐾 🐾 🐾 🐾 ☆",
      status: "夜間監視継続",
      officer: "ミケ監視官",
      total: "総合評価：N-7"
    },
    {
      image: "images/reports/report-cat-02.webp",
      badge: "お昼寝確認",
      title: "休憩中の偽装監視",
      description: "一見すると完全なお昼寝ですが、耳としっぽの反応から周囲の人間行動を継続観察している可能性があります。",
      score: "🐾 🐾 🐾 ☆ ☆",
      status: "省電力監視中",
      officer: "チャトラ分析官",
      total: "総合評価：N-4"
    },
    {
      image: "images/reports/report-cat-03.webp",
      badge: "見守り強化中",
      title: "在宅ワーク監視記録",
      description: "机上および周辺端末への接近を確認。キーボード占拠、画面前待機、集中力の吸収を含む高度な任務行動です。",
      score: "🐾 🐾 🐾 🐾 🐾",
      status: "重点監視対象",
      officer: "クロ主任",
      total: "総合評価：N-9"
    },
    {
      image: "images/reports/report-cat-04.webp",
      badge: "窓辺準備中",
      title: "外界観測ポイント確保",
      description: "窓辺の定位置を確保し、通行人、鳥、風、帰宅予定者を同時監視。NNN通信網への報告準備が進行中です。",
      score: "🐾 🐾 🐾 🐾 ☆",
      status: "通信待機",
      officer: "シロ補佐官",
      total: "総合評価：N-6"
    }
  ];

  if (reportImage && reportBadge && reportTitle && reportDescription && reportScore && reportStatus && reportOfficer && reportTotal) {
    var selectedReport = reportPatterns[Math.floor(Math.random() * reportPatterns.length)];
    reportImage.src = selectedReport.image;
    reportImage.alt = selectedReport.badge + "の監視対象猫";
    reportBadge.textContent = selectedReport.badge;
    reportTitle.textContent = selectedReport.title;
    reportDescription.textContent = selectedReport.description;
    reportScore.textContent = selectedReport.score;
    reportStatus.textContent = selectedReport.status;
    reportOfficer.textContent = selectedReport.officer;
    reportTotal.textContent = selectedReport.total;
  }

  var diagnosisForm = document.getElementById("diagnosisForm");
  var diagnosisResult = document.getElementById("diagnosisResult");

  var resultMessages = [
    {
      min: 0,
      max: 2,
      title: "監視対象外",
      code: "SAFE",
      status: "まだ安全圏",
      level: "★☆☆☆☆",
      className: "safe",
      text: "現在のところNNNの監視網には大きな反応がありません。ただし、猫は気まぐれです。次の満月まで油断は禁物です。"
    },
    {
      min: 3,
      max: 4,
      title: "軽度ロックオン",
      code: "WATCH",
      status: "周辺監視開始",
      level: "★★★☆☆",
      className: "watch",
      text: "あなたの周辺に、猫の気配が少しずつ増えています。道端で目が合う猫は、ただ通りすがっただけではないかもしれません。"
    },
    {
      min: 5,
      max: 6,
      title: "配属候補者",
      code: "CANDIDATE",
      status: "候補者リスト登録",
      level: "★★★★☆",
      className: "candidate",
      text: "NNNの資料棚に、あなたの名前がかなり濃いインクで記録されています。猫用品売り場での挙動には特に注目されています。"
    },
    {
      min: 7,
      max: 8,
      title: "正式配属待ち",
      code: "ASSIGNED",
      status: "配属準備完了",
      level: "★★★★★",
      className: "assigned",
      text: "ほぼ確定です。あなたは猫に見つかっています。近日中に、玄関、窓辺、帰り道のいずれかで追加任務が発生する可能性があります。"
    }
  ];

  function findResult(count) {
    return resultMessages.find(function (item) {
      return count >= item.min && count <= item.max;
    });
  }

  function buildShareUrl(text) {
    var url = window.location.href.split("#")[0];
    var shareText = encodeURIComponent(text + " #NNNロックオン診断");
    return "https://twitter.com/intent/tweet?text=" + shareText + "&url=" + encodeURIComponent(url);
  }

  if (diagnosisForm && diagnosisResult) {
    diagnosisForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var checkedCount = diagnosisForm.querySelectorAll("input[name='sign']:checked").length;
      var result = findResult(checkedCount);
      var shareSentence = "NNNロックオン診断の結果は「" + result.title + "」でした。チェック数は" + checkedCount + "個。";
      var lockPercent = Math.round((checkedCount / 8) * 100);

      diagnosisResult.className = "result-card diagnosis-result result-" + result.className;
      diagnosisResult.style.setProperty("--lock-percent", lockPercent + "%");
      diagnosisResult.innerHTML =
        '<div class="result-shadow-cat" aria-hidden="true"><img class="result-kitten-img" src="images/result-kitten.png" alt=""></div>' +
        '<p class="eyebrow">NNN SURVEILLANCE REPORT</p>' +
        "<h2>NNN監視判定報告書</h2>" +
        '<p class="result-classification">CLASSIFIED RESULT / NNN INTERNAL DOSSIER</p>' +
        '<div class="result-report-grid">' +
        '<div class="result-verdict">' +
        '<span class="result-code"><span aria-hidden="true">●</span>' + result.code + "</span>" +
        "<h3>" + result.title + "</h3>" +
        "<p>" + result.text + "</p>" +
        "</div>" +
        '<dl class="result-stats">' +
        "<div><dt>チェック数</dt><dd>" + checkedCount + " / 8</dd></div>" +
        '<div class="lock-meter-box"><dt>ロックオン度</dt><dd>' + result.level + '<span class="result-meter" aria-hidden="true"><span></span></span></dd></div>' +
        "<div><dt>ステータス</dt><dd>" + result.status + "</dd></div>" +
        "</dl>" +
        "</div>" +
        '<div class="share-actions">' +
        '<a class="button primary" target="_blank" rel="noopener" href="' + buildShareUrl(shareSentence) + '">Xでシェアする</a>' +
        '<a class="button secondary" href="notice.html">派遣候補通知メーカーへ</a>' +
        "</div>";

      diagnosisResult.classList.remove("hidden");
      diagnosisResult.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

})();
