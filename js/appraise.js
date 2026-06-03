(function () {
  "use strict";

  const codeNames = ["MOON-07", "SHADOW-12", "PAW-99", "BLACK-EYE", "WINDOW-03", "ROOF-21", "SOFTPAW-4", "WATCHER-9"];

  function initAppraisePage() {
    const form = document.getElementById("appraiseForm");
    const submitButton = document.getElementById("appraiseSubmit");
    const photoInput = document.getElementById("catPhoto");
    const photoPreview = document.getElementById("catPhotoPreview");
    const nameInput = document.getElementById("catName");
    const ageInput = document.getElementById("catAge");
    const errorMessage = document.getElementById("appraiseError");
    const resultArea = document.getElementById("appraiseResult");

    if (!form || !photoInput || !photoPreview || !nameInput || !ageInput || !errorMessage || !resultArea) {
      return;
    }

    let currentPhoto = "";
    let isSubmitting = false;

    function getRandomItem(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    function setError(message) {
      errorMessage.textContent = message;
    }

    function setPreview(src) {
      if (!src) {
        photoPreview.classList.add("hidden");
        photoPreview.removeAttribute("src");
        return;
      }

      photoPreview.src = src;
      photoPreview.classList.remove("hidden");
    }

    function resizeImageDataUrl(src, callback) {
      const image = new Image();

      image.addEventListener("load", function () {
        const maxSize = 900;
        const ratio = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          callback(src);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        callback(canvas.toDataURL("image/jpeg", 0.82));
      });

      image.addEventListener("error", function () {
        callback(src);
      });

      image.src = src;
    }

    function previewUploadedCatImage(file, callback) {
      if (!file) {
        callback(currentPhoto);
        return;
      }

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        resizeImageDataUrl(String(reader.result || ""), function (resizedPhoto) {
          currentPhoto = resizedPhoto;
          setPreview(currentPhoto);
          callback(currentPhoto);
        });
      });
      reader.addEventListener("error", function () {
        setError("猫写真の読み込みに失敗しました。別の画像でお試しください。");
        callback("");
      });
      reader.readAsDataURL(file);
    }

    function calculateDispatchProbability() {
      const meetPlace = Number(document.getElementById("meetPlace").value);
      const firstMood = Number(document.getElementById("firstMood").value);
      const humanAttitude = Number(document.getElementById("humanAttitude").value);
      const behaviorScore = Array.from(form.querySelectorAll("input[name='behavior']:checked"))
        .reduce(function (sum, checkbox) {
          return sum + Number(checkbox.value);
        }, 0);
      const photoBonus = currentPhoto || photoInput.files[0] ? 10 : 0;
      const age = Number(ageInput.value);
      const ageBonus = age <= 1 ? 6 : age >= 10 ? 4 : 8;

      return Math.min(100, Math.max(0, meetPlace + firstMood + humanAttitude + behaviorScore + photoBonus + ageBonus));
    }

    function getMeetRoute() {
      const meetPlaceSelect = document.getElementById("meetPlace");
      const selectedOption = meetPlaceSelect.options[meetPlaceSelect.selectedIndex];

      return selectedOption ? selectedOption.dataset.route : "";
    }

    function getRouteComment(route) {
      if (route === "petshop") {
        return "ペットショップ経由に見えますが、その出会いすらNNNの観測網によって仕組まれていた可能性があります。";
      }
      if (route === "breeder") {
        return "ブリーダー経由に見えますが、選んだつもりが選ばされていた可能性があります。NNNの介入は否定できません。";
      }
      return "";
    }

    function getRank(probability) {
      if (probability <= 24) {
        return {
          rank: "一般猫判定",
          comment: "通常の猫に見えますが、監視資質がわずかに確認されています。",
          evaluation: ["監視適性：低", "夜行性反応：中", "人間操作能力：中", "潜入性：低"]
        };
      }
      if (probability <= 49) {
        return {
          rank: "要観察対象",
          comment: "行動傾向から、NNN観測下にある可能性があります。まだ決定的証拠はありませんが、窓辺の視線には注意してください。",
          evaluation: ["監視適性：中", "夜行性反応：中", "人間操作能力：高", "潜入性：中"]
        };
      }
      if (probability <= 74) {
        return {
          rank: "派遣候補認定",
          comment: "複数の派遣猫特徴が確認されました。NNN内部では、すでに候補地として記録されている可能性があります。",
          evaluation: ["監視適性：高", "夜行性反応：高", "人間操作能力：高", "潜入性：高"]
        };
      }
      if (probability <= 89) {
        return {
          rank: "高確率NNN派遣猫",
          comment: "かなり高い確率でNNN派遣猫と推定されます。油断しないでください。",
          evaluation: ["監視適性：極めて高い", "夜行性反応：高", "人間操作能力：高", "潜入性：極めて高い"]
        };
      }
      return {
        rank: "ほぼNNN正式派遣案件",
        comment: "これはほぼNNN案件です。猫本人が否定しても、観測班は記録を続行します。",
        evaluation: ["監視適性：最高機密", "夜行性反応：極めて高い", "人間操作能力：最高", "潜入性：極めて高い"]
      };
    }

    function generateDispatchResult(photoData) {
      const probability = calculateDispatchProbability();
      const rankData = getRank(probability);
      const routeComment = getRouteComment(getMeetRoute());

      return {
        photo: photoData || currentPhoto || "",
        catName: nameInput.value.trim(),
        catAge: ageInput.value.trim(),
        dispatchProbability: probability,
        rank: rankData.rank,
        codeName: getRandomItem(codeNames),
        comment: routeComment ? rankData.comment + " " + routeComment : rankData.comment,
        evaluation: rankData.evaluation
      };
    }

    function renderResult(data) {
      const photo = data.photo ? '<img src="' + data.photo + '" alt="' + escapeHtml(data.catName) + 'の鑑定写真">' : '<span class="member-photo-placeholder">NO PHOTO</span>';
      resultArea.className = "appraise-result";
      resultArea.innerHTML =
        '<article class="appraise-report">' +
          '<div class="appraise-result-top">' +
            '<div class="appraise-photo">' + photo + '<span>CLASSIFIED PHOTO</span></div>' +
            '<div class="appraise-verdict">' +
              '<p class="eyebrow">NNN DISPATCH RESULT</p>' +
              "<h2>" + escapeHtml(data.rank) + "</h2>" +
              '<div class="dispatch-meter-block">' +
                '<div class="dispatch-percent"><span>派遣確率</span><strong>' + data.dispatchProbability + "%</strong></div>" +
                '<div class="dispatch-meter" aria-label="派遣確率' + data.dispatchProbability + '%"><span style="width:' + data.dispatchProbability + '%"></span></div>' +
              "</div>" +
            "</div>" +
          "</div>" +
        '<div class="appraise-report-body">' +
          '<dl class="appraise-result-meta">' +
            "<div><dt>猫名</dt><dd>" + escapeHtml(data.catName) + "</dd></div>" +
            "<div><dt>年齢</dt><dd>" + escapeHtml(data.catAge) + "歳</dd></div>" +
              "<div><dt>コードネーム</dt><dd>" + escapeHtml(data.codeName) + "</dd></div>" +
            "</dl>" +
            "<p>" + escapeHtml(data.comment) + "</p>" +
            '<ul class="internal-eval">' + data.evaluation.map(function (item) { return "<li>" + escapeHtml(item) + "</li>"; }).join("") + "</ul>" +
            '<div class="dispatch-actions">' +
              '<a class="button primary glow" href="membership.html" id="goMembership">この猫のNNN会員証を作る</a>' +
              '<button class="button secondary" type="button" id="retryAppraise">再鑑定する</button>' +
            "</div>" +
          "</div>" +
        "</article>";
      resultArea.scrollIntoView({ behavior: "smooth", block: "start" });

      const retryButton = document.getElementById("retryAppraise");
      if (retryButton) {
        retryButton.addEventListener("click", function () {
          resultArea.className = "appraise-result hidden";
          form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    }

    function saveForMembership(data) {
      try {
        sessionStorage.setItem("nnnDispatchResult", JSON.stringify(data));
      } catch (error) {
        const lightweightData = Object.assign({}, data, { photo: "" });
        try {
          sessionStorage.setItem("nnnDispatchResult", JSON.stringify(lightweightData));
        } catch (secondError) {
          return;
        }
      }
    }

    function validateForm() {
      if (!photoInput.files[0] && !currentPhoto) {
        setError("猫写真をアップロードしてください。NNN鑑定室が資料不足です。");
        photoInput.focus();
        return false;
      }
      if (!nameInput.value.trim()) {
        setError("猫の名前を入力してください。");
        nameInput.focus();
        return false;
      }
      if (!ageInput.value.trim()) {
        setError("猫の年齢を入力してください。");
        ageInput.focus();
        return false;
      }
      setError("");
      return true;
    }

    function handleAppraiseSubmit(event) {
      if (event) {
        event.preventDefault();
      }

      if (isSubmitting) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      isSubmitting = true;
      if (submitButton) {
        submitButton.disabled = true;
      }

      previewUploadedCatImage(photoInput.files[0], function (photoData) {
        const result = generateDispatchResult(photoData);
        renderResult(result);
        saveForMembership(result);
        isSubmitting = false;
        if (submitButton) {
          submitButton.disabled = false;
        }
      });
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    photoInput.addEventListener("change", function () {
      previewUploadedCatImage(photoInput.files[0], function () {});
    });

    form.addEventListener("submit", handleAppraiseSubmit);

    if (submitButton) {
      submitButton.addEventListener("click", function (event) {
        if (event.currentTarget.form) {
          return;
        }
        handleAppraiseSubmit(event);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAppraisePage);
  } else {
    initAppraisePage();
  }
})();
