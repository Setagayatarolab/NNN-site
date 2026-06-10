(function () {
  "use strict";

  const form = document.getElementById("memberForm");
  const photoInput = document.getElementById("memberPhoto");
  const photoPreview = document.getElementById("memberPhotoPreview");
  const nameInput = document.getElementById("memberCatName");
  const ageInput = document.getElementById("memberCatAge");
  const errorMessage = document.getElementById("memberError");
  const resultArea = document.getElementById("memberCardResult");
  const photoField = photoInput ? photoInput.closest(".upload-zone") : null;

  const teams = ["深夜巡回班", "窓辺監視班", "屋上観測班", "月光追尾班", "肉球通信課", "黒猫特務班"];
  const codeNames = ["MOON-07", "SHADOW-12", "SOFTPAW-4", "WATCHER-9", "WINDOW-03", "ROOF-21", "LUNA-07", "NOIR-11", "WATCHER-09", "MOON-04"];
  const cardRanks = ["要観察対象", "派遣候補", "準会員級", "極秘認定", "監視協力猫"];
  const approvalSeals = ["VERIFIED", "APPROVED", "NNN承認", "極秘認証"];
  let inheritedData = loadInheritedData();
  let currentPhoto = inheritedData.photo || "";
  let validationAttempted = false;

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
      catName: getMemberNameValue(),
      catAge: getMemberAgeValue(),
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
    const status = document.getElementById("memberCaptureStatus");

    errorMessage.textContent = "";
    showCaptureStatus(status, "会員証画像を生成しています。少しだけお待ちください。", false);
    downloadMemberCardCanvas(data).then(function () {
      showCaptureStatus(status, "会員証画像を保存しました。X投稿時に添付してください。", false);
    }).catch(function (error) {
      console.error(error);
      showCaptureStatus(status, "画像保存に失敗しました。猫写真の読み込み状態を確認して、もう一度お試しください。", true);
    });
  }

  async function downloadMemberCardCanvas(data) {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvasを初期化できませんでした。");
    }

    drawCanvasBackground(ctx, canvas.width, canvas.height);
    drawMemberEmblem(ctx, 86, 86, 54);
    drawCanvasHeader(ctx, data);
    await drawCanvasPhoto(ctx, data.photo, data.catName, resultArea.querySelector(".member-photo img"));
    drawCanvasInfo(ctx, data);
    drawCanvasAuthStrip(ctx, data);
    drawCanvasFooter(ctx, data);

    const blob = await canvasToPngBlob(canvas);
    downloadBlob(blob, "nnn-member-card-" + data.memberId + ".png");
  }

  function canvasToPngBlob(canvas) {
    return new Promise(function (resolve, reject) {
      if (!canvas.toBlob) {
        try {
          const dataUrl = canvas.toDataURL("image/png");
          const binary = atob(dataUrl.split(",")[1]);
          const bytes = new Uint8Array(binary.length);
          for (let index = 0; index < binary.length; index += 1) {
            bytes[index] = binary.charCodeAt(index);
          }
          resolve(new Blob([bytes], { type: "image/png" }));
        } catch (error) {
          reject(error);
        }
        return;
      }

      canvas.toBlob(function (blob) {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("PNGデータを生成できませんでした。"));
        }
      }, "image/png");
    });
  }

  function downloadBlob(blob, filename) {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(function () {
      URL.revokeObjectURL(objectUrl);
    }, 5000);
  }

  function drawCanvasBackground(ctx, width, height) {
    const bg = ctx.createLinearGradient(0, 0, width, height);
    bg.addColorStop(0, "#101d5c");
    bg.addColorStop(0.52, "#25104f");
    bg.addColorStop(1, "#050a20");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    drawGlow(ctx, 230, 145, 220, "rgba(125,224,255,0.22)");
    drawGlow(ctx, 930, 560, 260, "rgba(255,136,238,0.18)");
    drawGlow(ctx, 980, 105, 180, "rgba(244,217,146,0.18)");

    ctx.save();
    ctx.globalAlpha = 0.06;
    ctx.strokeStyle = "#f4d992";
    ctx.lineWidth = 1;
    for (let x = 36; x < width; x += 58) {
      ctx.beginPath();
      ctx.moveTo(x, 38);
      ctx.lineTo(x, height - 38);
      ctx.stroke();
    }
    for (let y = 52; y < height; y += 58) {
      ctx.beginPath();
      ctx.moveTo(36, y);
      ctx.lineTo(width - 36, y);
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#f4d992";
    ctx.font = "900 128px Georgia, serif";
    ctx.letterSpacing = "8px";
    ctx.fillText("NNN", 780, 610);
    ctx.restore();

    roundedStroke(ctx, 26, 26, width - 52, height - 52, 24, "#f4d992", 3);
    roundedStroke(ctx, 42, 42, width - 84, height - 84, 18, "rgba(244,217,146,0.28)", 1);
  }

  function drawGlow(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawCanvasHeader(ctx, data) {
    ctx.fillStyle = "#f4d992";
    ctx.font = "900 24px 'Yu Gothic', Meiryo, sans-serif";
    ctx.letterSpacing = "4px";
    ctx.fillText("NEKO NEKO NETWORK MEMBER", 156, 74);

    ctx.fillStyle = "#fff7dc";
    ctx.shadowColor = "rgba(244,217,146,0.35)";
    ctx.shadowBlur = 18;
    ctx.font = "900 58px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("極秘会員証", 156, 134);
    ctx.shadowBlur = 0;

    ctx.fillStyle = "rgba(125,224,255,0.88)";
    ctx.font = "900 18px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("INTERNAL MEMBER DOSSIER", 158, 166);

    drawRoundLabel(ctx, 952, 58, 116, 116, data.approvalSeal, "rgba(255,136,238,0.32)", "#ffcff7", true);
  }

  async function drawCanvasPhoto(ctx, src, catName, previewImage) {
    const x = 70;
    const y = 210;
    const width = 430;
    const height = 270;

    roundedFill(ctx, x, y, width, height, 18, "rgba(5,8,30,0.86)");
    roundedStroke(ctx, x, y, width, height, 18, "rgba(244,217,146,0.62)", 3);
    roundedStroke(ctx, x + 12, y + 12, width - 24, height - 24, 12, "rgba(244,217,146,0.22)", 1);

    if (previewImage && previewImage.complete && previewImage.naturalWidth > 0) {
      drawImageContain(ctx, previewImage, x + 14, y + 14, width - 28, height - 28);
    } else if (src) {
      try {
        const image = await loadCanvasImage(src);
        drawImageContain(ctx, image, x + 14, y + 14, width - 28, height - 28);
      } catch (error) {
        drawPhotoPlaceholder(ctx, x, y, width, height, catName);
      }
    } else {
      drawPhotoPlaceholder(ctx, x, y, width, height, catName);
    }

    roundedFill(ctx, x + 22, y + height - 48, 164, 30, 15, "rgba(4,8,28,0.76)");
    ctx.strokeStyle = "rgba(125,224,255,0.52)";
    ctx.lineWidth = 1;
    roundRectPath(ctx, x + 22, y + height - 48, 164, 30, 15);
    ctx.stroke();
    ctx.fillStyle = "#daf6ff";
    ctx.font = "900 15px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("PHOTO VERIFIED", x + 36, y + height - 28);
  }

  function drawPhotoPlaceholder(ctx, x, y, width, height, catName) {
    ctx.save();
    ctx.fillStyle = "rgba(244,217,146,0.2)";
    ctx.font = "900 38px 'Yu Gothic', Meiryo, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(catName || "NO PHOTO", x + width / 2, y + height / 2);
    ctx.restore();
  }

  function drawCanvasInfo(ctx, data) {
    const rows = [
      ["猫名", data.catName],
      ["年齢", data.catAge + "歳"],
      ["会員番号", data.memberId],
      ["コードネーム", data.codeName],
      ["所属班", data.team],
      ["派遣認定度", data.certification],
      ["鑑定ランク", data.rank],
      ["発行日", data.issueDate]
    ];
    const startX = 540;
    const startY = 212;
    const boxW = 446;
    const boxH = 46;
    const gap = 12;

    rows.forEach(function (row, index) {
      const y = startY + index * (boxH + gap);
      const gradient = ctx.createLinearGradient(startX, y, startX + boxW, y + boxH);
      gradient.addColorStop(0, "rgba(125,224,255,0.12)");
      gradient.addColorStop(1, "rgba(244,217,146,0.08)");
      roundedFill(ctx, startX, y, boxW, boxH, 10, gradient);
      roundedStroke(ctx, startX, y, boxW, boxH, 10, "rgba(244,217,146,0.32)", 1);

      ctx.fillStyle = "#7de0ff";
      ctx.font = "900 16px 'Yu Gothic', Meiryo, sans-serif";
      ctx.fillText(row[0], startX + 18, y + 29);
      ctx.fillStyle = "#fff0a6";
      ctx.font = "900 22px 'Yu Gothic', Meiryo, sans-serif";
      fitText(ctx, String(row[1]), startX + 150, y + 30, boxW - 170);
    });
  }

  function drawCanvasAuthStrip(ctx, data) {
    const x = 70;
    const y = 505;
    const width = 430;
    const height = 86;

    roundedFill(ctx, x, y, width, height, 16, "rgba(5,8,30,0.66)");
    roundedStroke(ctx, x, y, width, height, 16, "rgba(244,217,146,0.36)", 2);

    ctx.fillStyle = "#7de0ff";
    ctx.font = "900 15px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("NNN-ID CODE", x + 20, y + 30);
    ctx.fillStyle = "#fff7dc";
    ctx.font = "900 17px 'Yu Gothic', Meiryo, sans-serif";
    fitText(ctx, data.memberId + " / " + data.codeName, x + 20, y + 58, 210);

    drawBarcode(ctx, x + 250, y + 22, 72, 42);
    drawRoundLabel(ctx, x + 340, y + 15, 60, 60, "VERIFIED\nBY NNN", "rgba(88,53,142,0.5)", "#fff7dc", false);
  }

  function drawCanvasFooter(ctx, data) {
    const code = getCardSerial(data.memberId, data.codeName);

    ctx.strokeStyle = "rgba(244,217,146,0.24)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(70, 632);
    ctx.lineTo(1130, 632);
    ctx.stroke();

    ctx.fillStyle = "rgba(218,246,255,0.86)";
    ctx.font = "900 17px 'Yu Gothic', Meiryo, sans-serif";
    fitText(ctx, code, 70, 668, 710);

    ctx.fillStyle = "#f4d992";
    ctx.font = "900 20px 'Yu Gothic', Meiryo, sans-serif";
    ctx.fillText("CLASSIFIED CAT ID", 860, 668);

    ctx.fillStyle = "rgba(244,217,146,0.75)";
    ctx.font = "900 20px Georgia, serif";
    ctx.fillText("✦  PAW NETWORK VERIFIED  ✦", 70, 612);
  }

  function drawMemberEmblem(ctx, x, y, radius) {
    ctx.save();
    ctx.strokeStyle = "#f4d992";
    ctx.fillStyle = "rgba(244,217,146,0.08)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, radius - 13, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#f4d992";
    ctx.font = "900 24px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("NNN", x, y + 2);
    ctx.restore();
  }

  function drawRoundLabel(ctx, x, y, width, height, text, fill, color, rotate) {
    ctx.save();
    if (rotate) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(-0.12);
      x = -width / 2;
      y = -height / 2;
    }
    roundedFill(ctx, x, y, width, height, Math.min(width, height) / 2, fill);
    roundedStroke(ctx, x, y, width, height, Math.min(width, height) / 2, "rgba(244,217,146,0.58)", 2);
    ctx.fillStyle = color;
    ctx.font = "900 16px 'Yu Gothic', Meiryo, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    String(text).split("\n").forEach(function (line, index, lines) {
      ctx.fillText(line, x + width / 2, y + height / 2 + (index - (lines.length - 1) / 2) * 18);
    });
    ctx.restore();
  }

  function drawBarcode(ctx, x, y, width, height) {
    const bars = [4, 2, 7, 3, 2, 6, 4, 2, 8, 3, 5, 2];
    let cursor = x;
    ctx.save();
    ctx.fillStyle = "#f4d992";
    bars.forEach(function (bar, index) {
      ctx.globalAlpha = index % 3 === 0 ? 0.55 : 0.9;
      ctx.fillRect(cursor, y, bar, height);
      cursor += bar + 4;
    });
    roundedStroke(ctx, x - 8, y - 8, width + 16, height + 16, 8, "rgba(125,224,255,0.28)", 1);
    ctx.restore();
  }

  function roundedFill(ctx, x, y, width, height, radius, fillStyle) {
    roundRectPath(ctx, x, y, width, height, radius);
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }

  function roundedStroke(ctx, x, y, width, height, radius, strokeStyle, lineWidth) {
    roundRectPath(ctx, x, y, width, height, radius);
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  function roundRectPath(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function loadCanvasImage(src) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      const timeout = window.setTimeout(function () {
        reject(new Error("猫写真の読み込みがタイムアウトしました。"));
      }, 10000);
      image.onload = function () {
        window.clearTimeout(timeout);
        resolve(image);
      };
      image.onerror = function () {
        window.clearTimeout(timeout);
        reject(new Error("猫写真を読み込めませんでした。"));
      };
      image.src = src;
    });
  }

  function drawImageContain(ctx, image, x, y, boxWidth, boxHeight) {
    const sourceWidth = image.naturalWidth || image.videoWidth || image.width;
    const sourceHeight = image.naturalHeight || image.videoHeight || image.height;

    if (!sourceWidth || !sourceHeight) {
      throw new Error("猫写真のサイズを取得できませんでした。");
    }

    const fitScale = Math.min(boxWidth / sourceWidth, boxHeight / sourceHeight);
    const scale = Math.min(fitScale, 2);
    const drawWidth = Math.max(1, sourceWidth * scale);
    const drawHeight = Math.max(1, sourceHeight * scale);
    const drawX = x + (boxWidth - drawWidth) / 2;
    const drawY = y + (boxHeight - drawHeight) / 2;

    ctx.save();
    roundRectPath(ctx, x, y, boxWidth, boxHeight, 12);
    ctx.clip();
    ctx.fillStyle = "#070b1f";
    ctx.fillRect(x, y, boxWidth, boxHeight);
    ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }

  function fitText(ctx, text, x, y, maxWidth) {
    let output = text;
    while (ctx.measureText(output).width > maxWidth && output.length > 1) {
      output = output.slice(0, -2) + "…";
    }
    ctx.fillText(output, x, y);
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

  function getInheritedValue(key) {
    const value = inheritedData[key];
    return value === undefined || value === null ? "" : String(value).trim();
  }

  function getMemberNameValue() {
    const inputValue = nameInput ? nameInput.value.trim() : "";
    return inputValue || getInheritedValue("catName");
  }

  function getMemberAgeValue() {
    const inputValue = ageInput ? ageInput.value.trim() : "";
    return inputValue || getInheritedValue("catAge");
  }

  function hasMemberPhoto() {
    const hasUploadedFile = Boolean(
      photoInput &&
      photoInput.files &&
      photoInput.files.length > 0
    );
    const hasCurrentPhoto = typeof currentPhoto === "string" && currentPhoto.trim() !== "";
    const inheritedPhoto = getInheritedValue("photo");

    return hasUploadedFile || hasCurrentPhoto || inheritedPhoto !== "";
  }

  function hasMemberName() {
    return getMemberNameValue() !== "";
  }

  function hasMemberAge() {
    const ageValue = getMemberAgeValue();
    if (ageValue === "") return false;

    const numericAge = Number(ageValue);
    return Number.isFinite(numericAge) && numericAge >= 0;
  }

  function setFieldError(field, input, hasError) {
    if (field) field.classList.toggle("is-error", hasError);
    if (input) {
      input.classList.toggle("is-error", hasError);
      input.setAttribute("aria-invalid", hasError ? "true" : "false");
    }
  }

  function renderMemberErrors(errors) {
    if (!errorMessage) return;

    errorMessage.replaceChildren();
    if (errors.length === 0) return;

    const heading = document.createElement("span");
    heading.className = "member-error-heading";
    heading.textContent = "NNN認証端末が未登録項目を検出しました。";

    const list = document.createElement("ul");
    list.className = "member-error-list";
    errors.forEach(function (error) {
      const item = document.createElement("li");
      item.textContent = error.message;
      list.appendChild(item);
    });

    errorMessage.append(heading, list);
  }

  function focusFirstMemberError(error) {
    if (!error) return;

    if (error.type === "photo" && photoField) {
      photoField.scrollIntoView({ behavior: "smooth", block: "center" });
      if (photoInput) photoInput.focus({ preventScroll: true });
      return;
    }

    const input = error.type === "name" ? nameInput : ageInput;
    if (input) {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus({ preventScroll: true });
    }
  }

  function validateMemberForm(options) {
    const settings = options || {};
    const errors = [];
    const photoMissing = !hasMemberPhoto();
    const nameMissing = !hasMemberName();
    const ageMissing = !hasMemberAge();

    if (photoMissing) {
      errors.push({ type: "photo", message: "猫写真を登録してください。" });
    }
    if (nameMissing) {
      errors.push({ type: "name", message: "猫の名前を入力してください。" });
    }
    if (ageMissing) {
      errors.push({ type: "age", message: "猫の年齢を入力してください。" });
    }

    setFieldError(photoField, photoInput, photoMissing);
    setFieldError(null, nameInput, nameMissing);
    setFieldError(null, ageInput, ageMissing);
    renderMemberErrors(errors);

    if (settings.focusFirst !== false && errors.length > 0) {
      focusFirstMemberError(errors[0]);
    }

    return errors;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  if (getInheritedValue("catName")) nameInput.value = inheritedData.catName;
  if (getInheritedValue("catAge")) ageInput.value = inheritedData.catAge;
  if (currentPhoto) setPreview(currentPhoto);

  if (photoInput) {
    photoInput.addEventListener("change", function () {
      previewUploadedCatImage(photoInput.files[0], function () {
        if (validationAttempted) validateMemberForm({ focusFirst: false });
      });
    });
  }

  [nameInput, ageInput].forEach(function (input) {
    if (!input) return;
    input.addEventListener("input", function () {
      if (validationAttempted) validateMemberForm({ focusFirst: false });
    });
  });

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      validationAttempted = true;
      if (validateMemberForm().length > 0) return;

      previewUploadedCatImage(photoInput.files[0], function (photoData) {
        renderMemberCard(generateMemberCard(photoData));
      });
    });
  }
})();
