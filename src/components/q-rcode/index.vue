<template>
  <img :src="imgData" alt="" />
</template>
<script>
import QRCode from "qr.js/lib/QRCode";
import ErrorCorrectLevel from "qr.js/lib/ErrorCorrectLevel";

export default {
  props: {
    text: {
      type: String,
      required: true,
      default: ""
    },
    size: {
      type: Number,
      default: 100
    },
    level: {
      type: String,
      default: "H",
      validator: l => ["L", "M", "Q", "H"].indexOf(l) > -1
    },
    background: {
      type: String,
      default: "#fff"
    },
    foreground: {
      type: String,
      default: "#000"
    },
    logo: {
      type: String,
      default: ""
    },
    logoSize: {
      type: Number,
      default: 30
    }
  },
  watch: {
    text() {
      this.render();
    }
  },
  data() {
    return {
      imgData: "",
      type: "png"
    };
  },
  methods: {
    async render() {
      const {
        text,
        size,
        level,
        background,
        foreground,
        logoSize,
        logo
      } = this;
      const _size = size >>> 0; // size to number
      // We'll use type===-1 to force QRCode to automatically pick the best type
      const qrCode = new QRCode(-1, ErrorCorrectLevel[level]);
      qrCode.addData(text);
      qrCode.make();

      const canvas = document.createElement("canvas");

      const ctx = canvas.getContext("2d");
      const cells = qrCode.modules;
      const tileW = _size / cells.length;
      const tileH = _size / cells.length;
      canvas.height = canvas.width = _size;
      ctx.scale(1, 1);
      cells.forEach(function(row, rdx) {
        row.forEach(function(cell, cdx) {
          ctx.fillStyle = cell ? foreground : background;
          const w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
          const h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
          ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
        });
      });
      if (logo) {
        const img = await this.imgLoad(this.logo);
        ctx.drawImage(
          img,
          _size / 2 - logoSize / 2,
          _size / 2 - logoSize / 2,
          logoSize,
          logoSize
        );
      }
      this.imgData = canvas.toDataURL(this.type);
      this.$emit("imgData", this.imgData);
    },
    imgLoad(url) {
      return new Promise(resolve => {
        const imgObj = new Image();
        imgObj.onload = function() {
          resolve(imgObj);
        };
        imgObj.src = url;
      });
    },
    _fixType(type) {
      type = type.toLowerCase().replace(/jpg/i, "jpeg");
      const r = type.match(/png|jpeg|bmp|gif/)[0];
      return "image/" + r;
    },
    saveImage() {
      const imgData = this.imgData.replace(
        this._fixType(this.type),
        "image/octet-stream"
      );
      const filename = "二维码_" + new Date().getTime() + "." + this.type;
      const saveLink = document.createElementNS(
        "http://www.w3.org/1999/xhtml",
        "a"
      );
      saveLink.href = imgData;
      saveLink.download = filename;

      const event = document.createEvent("MouseEvents");
      event.initMouseEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      saveLink.dispatchEvent(event);
    }
  },
  updated() {
    this.render();
  },
  async mounted() {
    this.render();
  }
};
</script>
