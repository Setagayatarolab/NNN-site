(function () {
  "use strict";

  const ranks = ["N-1", "N-3", "N-5", "N-7", "N-9", "S-1", "S-3", "X-2"];
  const departments = [
    "深夜巡回猫派遣局",
    "窓辺観測班",
    "黒猫班",
    "月光監視課",
    "肉球通信部",
    "玄関先潜入対策室",
    "猫派遣審査委員会",
    "中央観測評議会"
  ];
  const catTypes = [
    "黒猫型",
    "茶トラ先遣型",
    "ハチワレ潜入型",
    "白猫監視型",
    "長毛癒やし型",
    "子猫撹乱型",
    "窓辺待機型",
    "深夜巡回型"
  ];
  const stages = [
    "軽度観測中",
    "継続監視中",
    "派遣候補認定済",
    "優先審査対象",
    "極秘審査段階",
    "最終判定待機中"
  ];
  const comments = [
    "猫動画耐性が高く、候補地として安定しています。",
    "窓辺での外部気配察知能力に優れています。",
    "猫モチーフ収集傾向が確認されました。",
    "深夜帯の猫親和性が上昇傾向にあります。",
    "受け入れ体制は概ね良好と判断されます。",
    "近隣猫との遭遇頻度が基準値を超えています。",
    "今後の観測継続が推奨されます。",
    "派遣成立の可能性は比較的高いと見られます。"
  ];
  const seals = ["NNN承認", "極秘登録済", "派遣候補認定", "観測記録更新済"];

  const form = document.getElementById("dispatchNoticeForm");
  const nameInput = document.getElementById("dispatchName");
  const codeInput = document.getElementById("dispatchCode");
  const watchTimeInput = document.getElementById("dispatchWatchTime");
  const preferenceInput = document.getElementById("dispatchPreference");
  const errorMessage = document.getElementById("dispatchFormError");
  const resultArea = document.getElementById("dispatchNoticeResult");

  function getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function createObservationNumber() {
    const prefix = getRandomItem(["NNN", "CAT", "OBS", "PAW", "MOON"]);
    const first = String(Math.floor(Math.random() * 90) + 10).padStart(2, "0");
    const second = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
    return prefix + "-2026-" + first + second;
  }

  function formatIssueDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "." + month + "." + day;
  }

  function validateNoticeForm() {
    const name = nameInput.value.trim();

    if (!name) {
      errorMessage.textContent = "対象者名を入力してください。NNN観測網が照合できません。";
      nameInput.focus();
      return null;
    }

    errorMessage.textContent = "";
    return name;
  }

  function generateNoticeData(name) {
    const watchTime = watchTimeInput.value || "指定なし";
    const preference = preferenceInput.value || getRandomItem(["黒猫", "茶トラ", "ハチワレ", "白猫", "長毛", "子猫", "おまかせ"]);
    const candidateCode = codeInput.value.trim() || createObservationNumber().replace("2026", "AREA");
    const catType = getRandomItem(catTypes);

    return {
      name: name,
      rank: getRandomItem(ranks),
      observationNumber: createObservationNumber(),
      department: getRandomItem(departments),
      catType: catType,
      stage: getRandomItem(stages),
      comment: getRandomItem(comments),
      seal: getRandomItem(seals),
      issueDate: formatIssueDate(new Date()),
      watchTime: watchTime,
      preference: preference,
      candidateCode: candidateCode,
      icon: getCatIcon(catType)
    };
  }

  function getCatIcon(catType) {
    if (catType.indexOf("黒猫") !== -1) return "黒";
    if (catType.indexOf("茶トラ") !== -1) return "茶";
    if (catType.indexOf("ハチワレ") !== -1) return "八";
    if (catType.indexOf("白猫") !== -1) return "白";
    if (catType.indexOf("長毛") !== -1) return "長";
    if (catType.indexOf("子猫") !== -1) return "仔";
    if (catType.indexOf("窓辺") !== -1) return "窓";
    return "夜";
  }

  function buildShareUrl(data) {
    const text = encodeURIComponent(
      "NNN派遣候補通知を発行しました。お宅の猫はすでに監視任務中かもしれません。 #NNN #猫 #派遣候補通知"
    );
    const url = encodeURIComponent(window.location.href.split("#")[0]);
    return "https://twitter.com/intent/tweet?text=" + text + "&url=" + url;
  }

  function renderNotice(data) {
    resultArea.className = "dispatch-result";
    resultArea.innerHTML =
      '<article class="dispatch-document">' +
        '<div class="dispatch-document-bg" aria-hidden="true"></div>' +
        '<div class="dispatch-bg-cat dispatch-bg-cat-symbol" aria-hidden="true">NNN</div>' +
        '<div class="dispatch-doc-header">' +
          '<div>' +
            '<p class="eyebrow">NNN INTERNAL / CLASSIFIED</p>' +
            "<h2>NNN極秘派遣候補通知書</h2>" +
          "</div>" +
          '<div class="dispatch-code">' +
            "<span>OBSERVATION No.</span>" +
            "<strong>" + escapeHtml(data.observationNumber) + "</strong>" +
          "</div>" +
        "</div>" +
        '<div class="dispatch-doc-main">' +
          '<section class="dispatch-letter">' +
            '<p class="dispatch-name">' + escapeHtml(data.name) + " 様</p>" +
            "<p>貴宅は、NNN猫派遣候補地として内部観測網に登録されました。</p>" +
            "<p>今後、窓辺の視線、玄関先の気配、深夜の猫動画推薦、黒猫との偶発的遭遇に十分ご注意ください。</p>" +
            "<p>適性観測の結果、現時点では派遣候補地ランクに到達しています。正式派遣の可否は、今後の猫親和性と受け入れ体制によって最終決定されます。</p>" +
          "</section>" +
          '<aside class="dispatch-profile">' +
            '<div class="dispatch-cat-icon" aria-hidden="true">' + escapeHtml(data.icon) + "</div>" +
            "<dl>" +
              "<div><dt>派遣候補ランク</dt><dd>" + escapeHtml(data.rank) + "</dd></div>" +
              "<div><dt>担当部署</dt><dd>" + escapeHtml(data.department) + "</dd></div>" +
              "<div><dt>派遣予定猫タイプ</dt><dd>" + escapeHtml(data.catType) + "</dd></div>" +
              "<div><dt>現在の監視段階</dt><dd>" + escapeHtml(data.stage) + "</dd></div>" +
              "<div><dt>候補地識別コード</dt><dd>" + escapeHtml(data.candidateCode) + "</dd></div>" +
              "<div><dt>希望観測時間帯</dt><dd>" + escapeHtml(data.watchTime) + "</dd></div>" +
              "<div><dt>猫傾向</dt><dd>" + escapeHtml(data.preference) + "</dd></div>" +
              "<div><dt>発行日</dt><dd>" + escapeHtml(data.issueDate) + "</dd></div>" +
            "</dl>" +
          "</aside>" +
        "</div>" +
        '<div class="dispatch-comment">' +
          '<span>INTERNAL COMMENT</span>' +
          "<p>" + escapeHtml(data.comment) + "</p>" +
        "</div>" +
        '<div class="dispatch-seal" aria-label="' + escapeHtml(data.seal) + '">' + escapeHtml(data.seal) + "</div>" +
      "</article>" +
      '<div class="dispatch-actions">' +
        '<button class="button secondary" type="button" id="reissueNoticeButton">再発行する</button>' +
        '<button class="button secondary save-image-button" type="button" id="saveNoticeImage">通知画像を保存</button>' +
        '<a class="button primary" target="_blank" rel="noopener" href="' + buildShareUrl(data) + '">Xでシェア</a>' +
      "</div>" +
      '<p class="share-guidance">画像を保存してからX投稿に添付してください</p>' +
      '<p id="noticeCaptureStatus" class="capture-status" role="status" aria-live="polite"></p>';

    resultArea.scrollIntoView({ behavior: "smooth", block: "start" });

    const reissueButton = document.getElementById("reissueNoticeButton");
    if (reissueButton) {
      reissueButton.addEventListener("click", function () {
        renderNotice(generateNoticeData(data.name));
      });
    }

    const saveButton = document.getElementById("saveNoticeImage");
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        saveNoticeImage(data);
      });
    }
  }

  function saveNoticeImage(data) {
    const notice = resultArea.querySelector(".dispatch-document");
    const status = document.getElementById("noticeCaptureStatus");
    if (!window.NNNCapture || !notice) {
      showCaptureStatus(status, "画像保存の準備に失敗しました。公開ページ上で開いているか確認してください。", true);
      return;
    }

    errorMessage.textContent = "";
    showCaptureStatus(status, "通知画像を生成しています。少しだけお待ちください。", false);
    window.NNNCapture.downloadElementAsPng(notice, "nnn-dispatch-notice-" + data.observationNumber + ".png", { pixelRatio: 2 }).then(function () {
      showCaptureStatus(status, "通知画像を保存しました。X投稿時に添付してください。", false);
    }).catch(function (error) {
      console.error(error);
      showCaptureStatus(status, "画像保存に失敗しました。公開ページ上で開いているか、画像が正しく読み込まれているか確認してください。", true);
    });
  }

  function showCaptureStatus(element, message, isError) {
    if (!element) {
      errorMessage.textContent = message;
      return;
    }

    element.textContent = message;
    element.classList.toggle("is-error", Boolean(isError));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (form && nameInput && resultArea) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = validateNoticeForm();

      if (!name) {
        return;
      }

      renderNotice(generateNoticeData(name));
    });
  }
})();
