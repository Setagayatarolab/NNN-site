(function () {
  "use strict";

  function collectPageStyles() {
    let css = "";

    Array.from(document.styleSheets).forEach(function (sheet) {
      try {
        Array.from(sheet.cssRules || []).forEach(function (rule) {
          css += rule.cssText + "\n";
        });
      } catch (error) {
        // Ignore unreadable stylesheets. The project CSS is same-origin on Pages.
      }
    });

    css += [
      "*{box-sizing:border-box;}",
      "body{margin:0;background:#071033;}",
      ".dispatch-actions,.share-guidance,.capture-status{display:none!important;}"
    ].join("\n");

    return css;
  }

  function waitForImages(element) {
    const images = Array.from(element.querySelectorAll("img"));

    return Promise.all(images.map(function (image) {
      if (image.complete && image.naturalWidth > 0) return Promise.resolve();
      if (image.decode) return image.decode().catch(function () {});

      return new Promise(function (resolve) {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    }));
  }

  function sanitizeFilename(name) {
    return String(name || "nnn-image.png")
      .replace(/[\\/:*?"<>|]+/g, "-")
      .replace(/\s+/g, "-")
      .slice(0, 90);
  }

  function loadImage(url) {
    return new Promise(function (resolve, reject) {
      const image = new Image();
      image.onload = function () {
        resolve(image);
      };
      image.onerror = reject;
      image.src = url;
    });
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async function inlineImages(sourceElement, clonedElement) {
    const sourceImages = Array.from(sourceElement.querySelectorAll("img"));
    const clonedImages = Array.from(clonedElement.querySelectorAll("img"));

    await Promise.all(sourceImages.map(async function (sourceImage, index) {
      const clonedImage = clonedImages[index];
      const src = sourceImage.currentSrc || sourceImage.src;

      if (!clonedImage || !src) return;
      if (src.indexOf("data:") === 0) {
        clonedImage.setAttribute("src", src);
        return;
      }

      try {
        const response = await fetch(src, { cache: "reload" });
        if (!response.ok) throw new Error("image fetch failed");
        const blob = await response.blob();
        clonedImage.setAttribute("src", await blobToDataUrl(blob));
      } catch (error) {
        // file:/// can block fetch for local assets. Leave the original src;
        // uploaded cat photos are already DataURL and remain safe.
        clonedImage.setAttribute("src", src);
      }
    }));
  }

  function makeSvgDataUrl(element, width, height) {
    const serialized = new XMLSerializer().serializeToString(element);
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '">',
      '<foreignObject width="100%" height="100%">',
      serialized,
      "</foreignObject>",
      "</svg>"
    ].join("");

    return URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  }

  async function downloadElementAsPng(element, filename, options) {
    if (!element) {
      throw new Error("画像化する要素が見つかりません。");
    }

    await waitForImages(element);

    const rect = element.getBoundingClientRect();
    const width = Math.max(1, Math.ceil(rect.width));
    const height = Math.max(1, Math.ceil(rect.height));
    const clone = element.cloneNode(true);
    const wrapper = document.createElement("div");

    await inlineImages(element, clone);

    wrapper.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
    wrapper.style.width = width + "px";
    wrapper.style.minHeight = height + "px";
    wrapper.innerHTML = "<style>" + collectPageStyles() + "</style>";
    wrapper.appendChild(clone);

    const svgUrl = makeSvgDataUrl(wrapper, width, height);

    try {
      const image = await loadImage(svgUrl);
      const pixelRatio = options && options.pixelRatio ? options.pixelRatio : 2;
      const scale = Math.min(2, pixelRatio);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = Math.ceil(width * scale);
      canvas.height = Math.ceil(height * scale);
      context.fillStyle = "#071033";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise(function (resolve) {
        canvas.toBlob(resolve, "image/png");
      });

      if (!blob) {
        throw new Error("画像の生成に失敗しました。");
      }

      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = sanitizeFilename(filename || "nnn-image.png");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      window.setTimeout(function () {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  }

  window.NNNCapture = {
    downloadElementAsPng: downloadElementAsPng,
    sanitizeFilename: sanitizeFilename
  };
})();
