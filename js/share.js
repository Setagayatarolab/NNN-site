(function () {
  "use strict";

  let activeOptions = null;
  let modal = null;
  let previouslyFocused = null;

  function createModal() {
    if (modal) return modal;

    modal = document.createElement("div");
    modal.className = "nnn-share-modal hidden";
    modal.setAttribute("aria-hidden", "true");
    modal.innerHTML =
      '<div class="nnn-share-backdrop" data-share-close></div>' +
      '<section class="nnn-share-dialog" role="dialog" aria-modal="true" aria-labelledby="nnnShareTitle">' +
        '<button class="nnn-share-close" type="button" aria-label="共有案内を閉じる" data-share-close>×</button>' +
        '<p class="eyebrow">NNN INTERNAL TRANSMISSION</p>' +
        '<h2 id="nnnShareTitle">NNN SHARE PROTOCOL</h2>' +
        '<h3>画像を添付してXでシェア</h3>' +
        '<p class="nnn-share-copy">生成した画像はXに自動では添付されません。<br>先に画像を保存し、Xの投稿画面で保存した画像を添付してください。</p>' +
        '<p class="nnn-share-note">スマホの対応環境では、画像付き共有を利用できる場合があります。</p>' +
        '<div class="nnn-share-actions">' +
          '<button class="button primary nnn-native-share hidden" type="button">画像付きで共有する</button>' +
          '<button class="button secondary nnn-save-share-image" type="button">画像を保存する</button>' +
          '<button class="button secondary nnn-open-x" type="button">Xの投稿画面を開く</button>' +
          '<button class="button ghost nnn-cancel-share" type="button" data-share-close>キャンセル</button>' +
        '</div>' +
        '<p class="nnn-share-status" role="status" aria-live="polite"></p>' +
        '<span class="nnn-share-classified" aria-hidden="true">IMAGE ATTACHMENT REQUIRED</span>' +
      "</section>";

    document.body.appendChild(modal);
    modal.addEventListener("click", handleModalClick);
    return modal;
  }

  function getElements() {
    const root = createModal();
    return {
      root: root,
      nativeShare: root.querySelector(".nnn-native-share"),
      save: root.querySelector(".nnn-save-share-image"),
      status: root.querySelector(".nnn-share-status"),
      close: root.querySelector(".nnn-share-close")
    };
  }

  function normalizeOptions(options) {
    return {
      filename: options.filename || "nnn-share.png",
      saveButtonLabel: options.saveButtonLabel || "画像を保存する",
      shareText: options.shareText || "NNN内部記録を共有します。 #NNN #猫",
      pageUrl: options.pageUrl || window.location.href.split("#")[0],
      savedMessage: options.savedMessage || "画像を保存しました。続けてXの投稿画面を開き、保存した画像を添付してください。",
      imageGenerator: options.imageGenerator,
      onStatus: typeof options.onStatus === "function" ? options.onStatus : null
    };
  }

  function openShareModal(options) {
    activeOptions = normalizeOptions(options || {});
    previouslyFocused = document.activeElement;
    const elements = getElements();

    elements.save.textContent = activeOptions.saveButtonLabel;
    elements.status.textContent = "";
    elements.status.classList.remove("is-error");
    elements.nativeShare.classList.toggle(
      "hidden",
      !(navigator.share && navigator.canShare && typeof File === "function")
    );
    elements.root.classList.remove("hidden");
    elements.root.setAttribute("aria-hidden", "false");
    document.body.classList.add("share-modal-open");
    window.addEventListener("keydown", handleKeydown);
    window.setTimeout(function () {
      elements.close.focus();
    }, 0);
  }

  function closeShareModal() {
    if (!modal) return;
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("share-modal-open");
    window.removeEventListener("keydown", handleKeydown);
    if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    activeOptions = null;
  }

  function handleKeydown(event) {
    if (event.key === "Escape") closeShareModal();
  }

  function handleModalClick(event) {
    if (event.target.closest("[data-share-close]")) return closeShareModal();
    if (event.target.closest(".nnn-save-share-image")) return saveGeneratedImage();
    if (event.target.closest(".nnn-native-share")) return shareGeneratedImage();
    if (event.target.closest(".nnn-open-x")) openXIntent();
  }

  function showShareStatus(message, isError) {
    const elements = getElements();
    elements.status.textContent = message;
    elements.status.classList.toggle("is-error", Boolean(isError));
    if (activeOptions && activeOptions.onStatus) activeOptions.onStatus(message, Boolean(isError));
  }

  async function createImageBlob() {
    if (!activeOptions || typeof activeOptions.imageGenerator !== "function") {
      throw new Error("共有画像の生成処理が設定されていません。");
    }
    const blob = await activeOptions.imageGenerator();
    if (!(blob instanceof Blob)) throw new Error("共有画像を生成できませんでした。");
    return blob;
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1200);
  }

  async function saveGeneratedImage() {
    if (!activeOptions) return;
    try {
      showShareStatus("共有画像を生成しています。少しだけお待ちください。", false);
      downloadBlob(await createImageBlob(), activeOptions.filename);
      showShareStatus(activeOptions.savedMessage, false);
    } catch (error) {
      console.error(error);
      showShareStatus("画像の生成に失敗しました。画像が読み込まれているか確認して、もう一度お試しください。", true);
    }
  }

  async function shareGeneratedImage() {
    if (!activeOptions || !navigator.share || !navigator.canShare) return;
    try {
      showShareStatus("画像付き共有の準備をしています。", false);
      const blob = await createImageBlob();
      const file = new File([blob], activeOptions.filename, { type: "image/png" });
      if (!navigator.canShare({ files: [file] })) {
        showShareStatus("この端末は画像付き共有に対応していません。画像を保存してからXへ添付してください。", true);
        return;
      }
      await navigator.share({
        files: [file],
        text: activeOptions.shareText,
        url: activeOptions.pageUrl
      });
      showShareStatus("端末の共有画面へ画像を渡しました。", false);
    } catch (error) {
      if (error && error.name === "AbortError") {
        showShareStatus("画像付き共有をキャンセルしました。", false);
        return;
      }
      console.error(error);
      showShareStatus("画像付き共有を開始できませんでした。画像保存方式をご利用ください。", true);
    }
  }

  function openXIntent() {
    if (!activeOptions) return;
    showShareStatus("画像は自動添付されません。保存済みの画像を投稿画面で選択してください。", false);
    const intent =
      "https://twitter.com/intent/tweet?text=" +
      encodeURIComponent(activeOptions.shareText) +
      "&url=" +
      encodeURIComponent(activeOptions.pageUrl);
    window.open(intent, "_blank", "noopener,noreferrer");
  }

  window.NNNShare = {
    openShareModal: openShareModal,
    closeShareModal: closeShareModal,
    saveGeneratedImage: saveGeneratedImage,
    shareGeneratedImage: shareGeneratedImage,
    openXIntent: openXIntent,
    showShareStatus: showShareStatus
  };
})();
