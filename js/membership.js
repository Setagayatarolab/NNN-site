(function () {
  "use strict";

  const form = document.getElementById("memberForm");
  const photoInput = document.getElementById("memberPhoto");
  const photoPreview = document.getElementById("memberPhotoPreview");
  const nameInput = document.getElementById("memberCatName");
  const ageInput = document.getElementById("memberCatAge");
  const errorMessage = document.getElementById("memberError");
  const resultArea = document.getElementById("memberCardResult");

  const teams = ["深夜巡回班", "窓辺監視班", "屋上観測班", "月光追尾班", "肉球通信課", "黒猫特務班"];
  const codeNames = ["MOON-07", "SHADOW-12", "SOFTPAW-4", "WATCHER-9", "WINDOW-03", "ROOF-21", "LUNA-07", "NOIR-11", "WATCHER-09", "MOON-04"];
  const cardRanks = ["要観察対象", "派遣候補", "準会員級", "極秘認定", "監視協力猫"];
  const approvalSeals = ["VERIFIED", "APPROVED", "NNN承認", "極秘認証"];
  let inheritedData = loadInheritedData();
  let currentPhoto = inheritedData.photo || "";

  function getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  function getRandomMemberId() {
    const prefix = getRandomItem(["NNN", "CAT", "MBR", "PAW"]);
    const number = String(Math.floor(Math.random() * 9000) + 1000);
    return prefix + "-" + number;
  }

  function getRandomTeam() {
    return getRandomItem(teams);
  }

  function getRandomCodeName() {
    return inheritedData.codeName || getRandomItem(codeNames);
  }

  function getRandomCardRank(probability) {
    if (inheritedData.rank) return inheritedData.rank;
    if (probability >= 90) return "極秘認定";
    if (probability >= 75) return "監視協力猫";
    if (probability >= 50) return "派遣候補";
    return getRandomItem(cardRanks);
  }

  function getCardSerial(memberId, codeName) {
    return "NNN-ID://" + memberId + "/" + codeName + "/MOON-SEAL";
  }

  function formatIssueDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "." + month + "." + day;
  }

  function loadInheritedData() {
    try {
      return JSON.parse(sessionStorage.getItem("nnnDispatchResult") || "{}");
    } catch (error) {
      return {};
    }
  }

  function setPreview(src) {
    if (!src) return;
    photoPreview.src = src;
    photoPreview.classList.remove("hidden");
  }

  function previewUploadedCatImage(file, callback) {
    if (!file) {
      callback(currentPhoto);
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", function () {
      currentPhoto = reader.result;
      setPreview(currentPhoto);
      callback(currentPhoto);
    });
    reader.readAsDataURL(file);
  }

  function getCertificationLabel(probability) {
    if (probability >= 90) return "正式派遣級 " + probability + "%";
    if (probability >= 75) return "NNN認定 " + probability + "%";
    if (probability >= 50) return "派遣候補 " + probability + "%";
    return "派遣疑惑 " + probability + "%";
  }

  function generateMemberCard(photoData) {
    const probability = Number(inheritedData.dispatchProbability) || Math.floor(Math.random() * 57) + 40;

    return {
      photo: photoData || currentPhoto,
      catName: nameInput.value.trim(),
      catAge: ageInput.value.trim(),
      memberId: getRandomMemberId(),
      codeName: getRandomCodeName(),
      team: getRandomTeam(),
      probability: probability,
      certification: getCertificationLabel(probability),
      rank: getRandomCardRank(probability),
      approvalSeal: getRandomItem(approvalSeals),
      issueDate: formatIssueDate(new Date())
    };
  }

  function renderMemberCard(data) {
    const photo = data.photo
      ? '<img src="' + data.photo + '" alt="' + escapeHtml(data.catName) + 'の会員証写真">'
      : '<span class="member-photo-placeholder">NO PHOTO</span>';
    const serialCode = getCardSerial(data.memberId, data.codeName);
    resultArea.className = "member-card-result";
    resultArea.innerHTML =
      '<article id="memberCardPreview" class="nnn-member-card">' +
        '<div class="member-card-pattern" aria-hidden="true"></div>' +
        '<div class="member-card-watermark member-card-watermark-text" aria-hidden="true">NNN</div>' +
        '<div class="member-card-head">' +
          '<div class="member-logo member-logo-mark" aria-label="NNN"><span>NNN</span></div>' +
          '<div><p class="eyebrow">NEKO NETWORK MEMBER</p><h2>極秘会員証</h2><small>INTERNAL MEMBER DOSSIER</small></div>' +
          '<span class="member-stamp">' + escapeHtml(data.approvalSeal) + '</span>' +
        "</div>" +
        '<div class="member-card-main">' +
          '<div class="member-visual">' +
            '<div class="member-photo">' + photo + '<span class="photo-auth">PHOTO VERIFIED</span></div>' +
            '<div class="member-auth-strip" aria-label="NNN認証情報">' +
              '<div class="member-auth-code">' +
                '<span>NNN-ID CODE</span>' +
                '<strong>' + escapeHtml(data.memberId) + " / " + escapeHtml(data.codeName) + '</strong>' +
              '</div>' +
              '<div class="member-barcode" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
              '<div class="member-verified-seal">' +
                '<span>VERIFIED</span>' +
                '<strong>BY NNN</strong>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<dl class="member-info">' +
            "<div><dt>猫名</dt><dd>" + escapeHtml(data.catName) + "</dd></div>" +
            "<div><dt>年齢</dt><dd>" + escapeHtml(data.catAge) + "歳</dd></div>" +
            "<div><dt>会員番号</dt><dd>" + escapeHtml(data.memberId) + "</dd></div>" +
            "<div><dt>コードネーム</dt><dd>" + escapeHtml(data.codeName) + "</dd></div>" +
            "<div><dt>所属班</dt><dd>" + escapeHtml(data.team) + "</dd></div>" +
            "<div><dt>派遣認定度</dt><dd>" + escapeHtml(data.certification) + "</dd></div>" +
            "<div><dt>鑑定ランク</dt><dd>" + escapeHtml(data.rank) + "</dd></div>" +
            "<div><dt>発行日</dt><dd>" + escapeHtml(data.issueDate) + "</dd></div>" +
          "</dl>" +
        "</div>" +
        '<div class="member-card-footer">' +
          '<span>' + escapeHtml(serialCode) + '</span>' +
          '<strong>CLASSIFIED CAT ID</strong>' +
        '</div>' +
      "</article>" +
      '<div class="dispatch-actions">' +
        '<button class="button secondary" type="button" id="regenerateMemberCard">再生成する</button>' +
        '<button class="button secondary save-image-button" type="button" id="saveMemberCardImage">会員証画像を保存</button>' +
        '<a class="button primary" target="_blank" rel="noopener" href="' + buildShareUrl() + '">Xでシェア</a>' +
      "</div>" +
      '<p class="share-guidance">画像を保存してからX投稿に添付してください</p>' +
      '<p id="memberCaptureStatus" class="capture-status" role="status" aria-live="polite"></p>';
    resultArea.scrollIntoView({ behavior: "smooth", block: "start" });

    const regenerateButton = document.getElementById("regenerateMemberCard");
    if (regenerateButton) {
      regenerateButton.addEventListener("click", function () {
        renderMemberCard(generateMemberCard(currentPhoto));
      });
    }

    const saveButton = document.getElementById("saveMemberCardImage");
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        saveMemberCardImage(data);
      });
    }
  }

  function saveMemberCardImage(data) {
    const card = document.getElementById("memberCardPreview");
    const status = document.getElementById("memberCaptureStatus");
    if (!window.NNNCapture || !card) {
      showCaptureStatus(status, "画像保存の準備に失敗しました。公開ページ上で開いているか確認してください。", true);
      return;
    }

    errorMessage.textContent = "";
    showCaptureStatus(status, "会員証画像を生成しています。少しだけお待ちください。", false);
    window.NNNCapture.downloadElementAsPng(card, "nnn-member-card-" + data.memberId + ".png", { pixelRatio: 2 }).then(function () {
      showCaptureStatus(status, "会員証画像を保存しました。X投稿時に添付してください。", false);
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

  function buildShareUrl() {
    const text = encodeURIComponent("NNN極秘会員証を発行しました。あなたの猫は監視対象かもしれません。 #NNN #猫 #会員証メーカー");
    const url = encodeURIComponent(window.location.href.split("#")[0]);
    return "https://twitter.com/intent/tweet?text=" + text + "&url=" + url;
  }

  function validateForm() {
    if (!nameInput.value.trim()) {
      errorMessage.textContent = "猫の名前を入力してください。";
      nameInput.focus();
      return false;
    }
    if (!ageInput.value.trim()) {
      errorMessage.textContent = "猫の年齢を入力してください。";
      ageInput.focus();
      return false;
    }
    errorMessage.textContent = "";
    return true;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (inheritedData.catName) nameInput.value = inheritedData.catName;
  if (inheritedData.catAge) ageInput.value = inheritedData.catAge;
  if (currentPhoto) setPreview(currentPhoto);

  if (photoInput) {
    photoInput.addEventListener("change", function () {
      previewUploadedCatImage(photoInput.files[0], function () {});
    });
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!validateForm()) return;

      previewUploadedCatImage(photoInput.files[0], function (photoData) {
        renderMemberCard(generateMemberCard(photoData));
      });
    });
  }
})();
