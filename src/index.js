const load_image = e => {
  const files = e.target.files;
  const filesArr = Array.prototype.slice.call(files);
  filesArr.forEach(file => {
    const reader = new FileReader();
    reader.onprogress = e => {
      const percent = e.loaded / e.total * 100;
      const datapos = percent_bar(percent);
      percent_counter(datapos);
    };
    reader.onload = e => {
      const image = new Image();
      image.className = "img-item";
      image.src = e.target.result;
      image.onload = imageEvent => {
        // Resize the image
        resize_image(image, file);
      };
    };
    reader.readAsDataURL(file);
  });
};

const resize_image = (image, file) => {
  let canvas = document.createElement("canvas"),
    max_size = 1280,
    width = image.width,
    height = image.height;

  if (width > height) {
    if (width > max_size) {
      height *= max_size / width;
      width = max_size;
    }
  } else {
    if (height > max_size) {
      width *= max_size / height;
      height = max_size;
    }
  }
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(image, 0, 0, width, height);
  const dataUrl = canvas.toDataURL(file.type);
  const imageValue = dataURLToBlob(dataUrl);

  const origin_size = Math.floor(file.size / 1000);
  const re_size = Math.floor(imageValue.size / 1000);
  const imgW = Math.floor(image.width);
  const imgH = Math.floor(image.height);
  const reW = Math.floor(width);
  const reH = Math.floor(height);

  $(".image-preview").prepend(
    `<div class="image-preview-item">
      <div class="size-info-wrapper">
        <div class="size-info">
          <div class="size-item">
            <p class="info-label">ORIGIN-SIZE</p>
            <div class="info-body">
              <span class="total-size">${imgW} * ${imgH}</span>
              <span>${origin_size} KB</span>
            </div>
          </div>
          <div class="size-item">
            <p class="info-label">RE-SIZE</p>
            <div class="info-body">
              <span class="total-size">${reW} * ${reH}</span>
              <span>${re_size} KB</span>
            </div>
          </div>
        </div>
      </div>
      <img src="${dataUrl}" class="img-item">
      <div class="download-btn">
        <a href="${dataUrl}" download="resized image">
          <img class="download-img" src="https://uploads.codesandbox.io/uploads/user/1dcc6c5f-ac13-4c27-b2e3-32ade1d213e9/5FeK-download.png">
        </a>
      </div>
    </div>`
  );
  $("html, body").animate(
    {
      scrollTop: $(".image-preview").offset().top
    },
    2000
  );
};

const dataURLToBlob = dataURL => {
  const BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) === -1) {
    const parts = dataURL.split(",");
    const contentType = parts[0].split(":")[1];
    const raw = parts[1];
    return new Blob([raw], {
      type: contentType
    });
  }
  const parts = dataURL.split(BASE64_MARKER);
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  let i = 0;
  while (i < rawLength) {
    uInt8Array[i] = raw.charCodeAt(i);
    i++;
  }
  return new Blob([uInt8Array], {
    type: contentType
  });
};

$(".image-upload").on("change", e => {
  load_image(e);
});

const percent_counter = datapos => {
  $(".loading-line").animate(
    { width: datapos },
    {
      easing: "linear",
      duration: 100,
      step: function(now) {
        var data = now;
        const datatwo = data.toFixed(0);
        const datapos = Math.abs(datatwo);
        $(".loading-percent").html(datapos + "%");
      }
    }
  );
  setTimeout(e => {
    $(".loading-bar").css("width", "0px");
    $(".loading-percent").html("0%");
  }, 3000);
};

const percent_bar = percent => {
  const datatwo = percent.toFixed(0);
  const datapos = Math.abs(datatwo);
  $(".loading-bar").css("width", `${datapos / 10}em`);
  return datapos;
};
