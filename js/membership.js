(function () {
  "use strict";

  const form = document.getElementById("memberForm");
  const photoInput = document.getElementById("memberPhoto");
  const photoPreview = document.getElementById("memberPhotoPreview");
  const nameInput = document.getElementById("memberCatName");
  const ageInput = document.getElementById("memberCatAge");
  const errorMessage = document.getElementById("memberError");
  const resultArea = document.getElementById("memberCardResult");

  const teams = ["深夜巡回班", "窓辺観測班", "玄関監視局", "月光潜入班", "肉球通信課", "黒猫特務班"];
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
    if (probability >= 75) return "派遣濃厚 " + probability + "%";
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
    const photo = data.photo ? '<img src="' + data.photo + '" alt="' + escapeHtml(data.catName) + 'の会員証写真">' : '<span class="member-photo-placeholder">NO PHOTO</span>';
    const serialCode = getCardSerial(data.memberId, data.codeName);
    resultArea.className = "member-card-result";
    resultArea.innerHTML =
      '<article class="nnn-member-card">' +
        '<div class="member-card-pattern" aria-hidden="true"></div>' +
        '<img class="member-card-watermark" src="assets/images/common/nnn-watermark.svg" alt="" aria-hidden="true">' +
        '<div class="member-card-head">' +
          '<img class="member-logo" src="assets/images/common/nnn-emblem.svg" alt="NNN">' +
          '<div><p class="eyebrow">NEKO NEKO NETWORK MEMBER</p><h2>極秘会員証</h2><small>INTERNAL MEMBER DOSSIER</small></div>' +
          '<span class="member-stamp">' + escapeHtml(data.approvalSeal) + '</span>' +
        "</div>" +
        '<div class="member-card-main">' +
          '<div class="member-photo">' + photo + '<span class="photo-auth">PHOTO VERIFIED</span></div>' +
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
        '<div class="dispatch-actions">' +
          '<button class="button secondary" type="button" id="regenerateMemberCard">再生成する</button>' +
          '<a class="button primary" target="_blank" rel="noopener" href="' + buildShareUrl(data) + '">Xでシェア</a>' +
        "</div>" +
      "</article>";
    resultArea.scrollIntoView({ behavior: "smooth", block: "start" });

    const regenerateButton = document.getElementById("regenerateMemberCard");
    if (regenerateButton) {
      regenerateButton.addEventListener("click", function () {
        renderMemberCard(generateMemberCard(currentPhoto));
      });
    }
  }

  function buildShareUrl(data) {
    const text = encodeURIComponent("NNN会員証を発行しました。コードネーム：" + data.codeName + " / " + data.certification + " #NNN会員証");
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
