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
  var currentDiagnosisShareData = null;

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

  function createDiagnosisImageBlob() {
    if (!currentDiagnosisShareData) return Promise.reject(new Error("診断結果がありません。"));

    var canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 720;
    var ctx = canvas.getContext("2d");
    if (!ctx) return Promise.reject(new Error("Canvasを初期化できませんでした。"));

    var gradient = ctx.createLinearGradient(0, 0, 1200, 720);
    gradient.addColorStop(0, "#0b1c50");
    gradient.addColorStop(0.52, "#17104e");
    gradient.addColorStop(1, "#070d25");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1200, 720);
    ctx.strokeStyle = "#f4d992";
    ctx.lineWidth = 4;
    ctx.strokeRect(24, 24, 1152, 672);
    ctx.strokeStyle = "rgba(125,224,255,.3)";
    ctx.lineWidth = 1;
    ctx.strokeRect(38, 38, 1124, 644);

    ctx.fillStyle = "#7de0ff";
    ctx.font = "800 20px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("NNN SURVEILLANCE REPORT", 70, 78);
    ctx.fillStyle = "#fff4ce";
    ctx.font = "900 50px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("NNN監視判定報告書", 70, 140);
    ctx.fillStyle = "#f4d992";
    ctx.font = "800 17px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("CLASSIFIED RESULT / NNN INTERNAL DOSSIER", 70, 177);

    ctx.fillStyle = "rgba(7,13,45,.76)";
    ctx.fillRect(68, 215, 680, 310);
    ctx.strokeStyle = "rgba(244,217,146,.38)";
    ctx.strokeRect(68, 215, 680, 310);
    ctx.fillStyle = "#7de0ff";
    ctx.font = "900 22px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("● " + currentDiagnosisShareData.code, 96, 260);
    ctx.fillStyle = "#fff4ce";
    ctx.font = "900 48px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText(currentDiagnosisShareData.title, 96, 330);
    ctx.font = "500 22px 'Yu Gothic', Meiryo, sans-serif";
    drawDiagnosisWrappedText(ctx, currentDiagnosisShareData.text, 96, 385, 610, 39);

    var stats = [
      ["チェック数", currentDiagnosisShareData.count + " / 8"],
      ["ロックオン度", currentDiagnosisShareData.level],
      ["ステータス", currentDiagnosisShareData.status]
    ];
    stats.forEach(function (row, index) {
      var y = 220 + index * 96;
      ctx.fillStyle = "rgba(17,24,67,.84)";
      ctx.fillRect(780, y, 340, 74);
      ctx.strokeStyle = "rgba(244,217,146,.35)";
      ctx.strokeRect(780, y, 340, 74);
      ctx.fillStyle = "#7de0ff";
      ctx.font = "800 16px 'Yu Gothic', Meiryo, sans-serif";
      ctx.fillText(row[0], 800, y + 25);
      ctx.fillStyle = "#f4d992";
      ctx.font = "900 26px 'Yu Gothic', Meiryo, sans-serif";
      ctx.fillText(String(row[1]), 800, y + 57);
    });

    ctx.fillStyle = "rgba(4,8,28,.8)";
    ctx.fillRect(780, 512, 340, 104);
    ctx.fillStyle = "#7de0ff";
    ctx.font = "800 15px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("LOCK-ON METER", 800, 540);
    ctx.fillStyle = "rgba(255,255,255,.12)";
    ctx.fillRect(800, 558, 290, 18);
    var meter = ctx.createLinearGradient(800, 0, 1090, 0);
    meter.addColorStop(0, "#7de0ff");
    meter.addColorStop(0.55, "#c477ff");
    meter.addColorStop(1, "#f4d992");
    ctx.fillStyle = meter;
    ctx.fillRect(800, 558, 290 * currentDiagnosisShareData.percent / 100, 18);
    ctx.fillStyle = "#fff4ce";
    ctx.font = "900 22px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText(currentDiagnosisShareData.percent + "%", 800, 607);

    ctx.save();
    ctx.translate(1000, 135);
    ctx.rotate(-0.12);
    ctx.strokeStyle = "#ff88ee";
    ctx.lineWidth = 3;
    ctx.strokeRect(-92, -28, 184, 56);
    ctx.fillStyle = "#ffc9f5";
    ctx.font = "900 21px 'Yu Gothic', Meiryo, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("TOP SECRET", 0, 8);
    ctx.restore();

    return loadDiagnosisKitten().then(function (image) {
      ctx.save();
      ctx.globalAlpha = 0.42;
      ctx.drawImage(image, 1010, 485, 150, 190);
      ctx.restore();
      return diagnosisCanvasToBlob(canvas);
    }).catch(function () {
      return diagnosisCanvasToBlob(canvas);
    });
  }

  function loadDiagnosisKitten() {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = function () { resolve(image); };
      image.onerror = reject;
      image.src = "images/result-kitten.png";
    });
  }

  function diagnosisCanvasToBlob(canvas) {
    return new Promise(function (resolve, reject) {
      canvas.toBlob(function (blob) {
        blob ? resolve(blob) : reject(new Error("診断結果画像を生成できませんでした。"));
      }, "image/png");
    });
  }

  function drawDiagnosisWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
    var line = "";
    var currentY = y;
    Array.from(text).forEach(function (character) {
      var testLine = line + character;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = character;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });
    if (line) ctx.fillText(line, x, currentY);
  }

  function downloadDiagnosisBlob(blob, filename) {
    var url = URL.createObjectURL(blob);
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function showDiagnosisShareStatus(message, isError) {
    var status = document.getElementById("diagnosisCaptureStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", Boolean(isError));
  }

  function saveDiagnosisImage() {
    showDiagnosisShareStatus("診断結果画像を生成しています。", false);
    createDiagnosisImageBlob()
      .then(function (blob) {
        downloadDiagnosisBlob(blob, "nnn-lock-on-result.png");
        showDiagnosisShareStatus("診断結果画像を保存しました。X投稿時に添付してください。", false);
      })
      .catch(function (error) {
        console.error(error);
        showDiagnosisShareStatus("診断結果画像の保存に失敗しました。もう一度お試しください。", true);
      });
  }

  function openDiagnosisShareModal() {
    if (!window.NNNShare) {
      showDiagnosisShareStatus("共有画面の準備に失敗しました。ページを再読み込みしてください。", true);
      return;
    }
    window.NNNShare.openShareModal({
      filename: "nnn-lock-on-result.png",
      saveButtonLabel: "診断結果画像を保存",
      shareText: "NNNロックオン診断の結果が出ました。\n猫たちの監視網に、すでに捕捉されているかもしれません。\n#NNN #猫 #ロックオン診断",
      savedMessage: "診断結果画像を保存しました。続けてXの投稿画面を開き、保存した画像を添付してください。",
      imageGenerator: createDiagnosisImageBlob,
      onStatus: showDiagnosisShareStatus
    });
  }

  if (diagnosisForm && diagnosisResult) {
    diagnosisForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var checkedCount = diagnosisForm.querySelectorAll("input[name='sign']:checked").length;
      var result = findResult(checkedCount);
      var lockPercent = Math.round((checkedCount / 8) * 100);
      currentDiagnosisShareData = {
        title: result.title,
        code: result.code,
        status: result.status,
        level: result.level,
        text: result.text,
        count: checkedCount,
        percent: lockPercent
      };

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
        '<button class="button secondary" type="button" id="saveDiagnosisImage">診断結果画像を保存</button>' +
        '<button class="button primary" type="button" id="shareDiagnosisResult">Xでシェアする</button>' +
        '<a class="button secondary" href="notice.html">派遣候補通知メーカーへ</a>' +
        "</div>" +
        '<p class="share-guidance">診断結果画像を保存してから、X投稿画面で添付してください。</p>' +
        '<p id="diagnosisCaptureStatus" class="capture-status" role="status" aria-live="polite"></p>';

      diagnosisResult.classList.remove("hidden");
      diagnosisResult.scrollIntoView({ behavior: "smooth", block: "start" });

      var saveDiagnosisButton = document.getElementById("saveDiagnosisImage");
      if (saveDiagnosisButton) saveDiagnosisButton.addEventListener("click", saveDiagnosisImage);

      var shareDiagnosisButton = document.getElementById("shareDiagnosisResult");
      if (shareDiagnosisButton) shareDiagnosisButton.addEventListener("click", openDiagnosisShareModal);
    });
  }

})();
