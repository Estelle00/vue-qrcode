<template>
  <div>
    <canvas ref="canvas" :width="size" :height="size"></canvas>
  </div>
</template>
<script>
  /* eslint-disable promise/param-names */
  import QRCode from 'qr.js/lib/QRCode'
  import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel'
  export default {
    name: 'harQrcode',
    props: {
      // 要编码的字符串
      text: {
        type: String,
        required: true,
        default: ''
      },
      /*
       * 二维码的宽和高，单位是px，只允许生成正方形二维码
       * 需要注意的是，当使用table绘制二维码时，会适当减小，使得能够整除二维码矩阵的维度。
       */
      size: {
        type: [Number, String],
        default: 256,
        validator: s => isNaN(Number(s)) !== true
      },
      // 纠错级别，可取0、1、2、3，数字越大说明所需纠错级别越大
      level: {
        type: String,
        default: 'H',
        validator: l => ['L', 'Q', 'M', 'H'].indexOf(l) > -1
      },
      // 背景色
      background: {
        type: String,
        default: '#fff'
      },
      // 前背景色
      foreground: {
        type: String,
        default: '#000'
      },
      // 码正中间图片的url，只支持配置正方形图片
      image: {
        type: String
      },
      // image的宽和高
      imageSize: {
        type: Number,
        default: 80
      }
    },
    data () {
      return {
      }
    },
    watch: {
      text () {
        this.render()
      }
    },
    methods: {
      getPixelRatio (context) {
        const backingStore = context.backingStorePixelRatio ||
          context.webkitBackingStorePixelRatio ||
          context.mozBackingStorePixelRatio ||
          context.msBackingStorePixelRatio ||
          context.oBackingStorePixelRatio ||
          context.backingStorePixelRatio ||
          1
        return (window.devicePixelRatio || 1) / backingStore
      },
      loadImg (url) {
        return new Promise((reslove, reject) => {
          const img = new Image()
          img.onload = function () {
            reslove(this)
            img.onload = null
          }
          img.src = url
        })
      },
      /**
       * 计算矩阵点的前景色
       * @param {Obj} config
       * @param {Number} row 点x坐标
       * @param {Number} col 点y坐标
       * @param {Number} count 矩阵大小
       * @return {String}
       */
      getForeGround ({row, col, count}) {
        const {pdground, foreground} = this
        const temp1 = row > 1 && row < 5 && col > 1 && col < 5
        const temp2 = row > count - 6 && row < count - 2 && col > 1 && col < 5
        const temp3 = row > 1 && row < 5 && col > count - 6 && col < count - 2
        if (pdground && (temp1 || temp2 || temp3)) {
          return pdground
        }
        return foreground
      },
      async render () {
        const {size, image, imageSize, background, foreground, level, text} = this
        // We'll use type===-1 to force QRCode to automatically pick the best type
        const qrCode = new QRCode(-1, ErrorCorrectLevel[level])
        qrCode.addData(text)
        qrCode.make()
        const canvas = this.$refs.canvas
        const ctx = canvas.getContext('2d')
        const cells = qrCode.modules
        const ratio = 2 // this.getPixelRatio(ctx)
        const ratioSize = ratio * size
        const tileSize = (ratioSize / cells.length).toPrecision(4)
        const ratioImgSize = imageSize * ratio
        console.log(ratio)
        ctx.scale(1 / ratio, 1 / ratio)
        // 绘制
        cells.forEach((row, rdx) => {
          row.forEach((cell, cdx) => {
            ctx.fillStyle = cell ? foreground : background
            const w = (Math.ceil((cdx + 1) * tileSize) - Math.floor(cdx * tileSize))
            const h = (Math.ceil((rdx + 1) * tileSize) - Math.floor(rdx * tileSize))
            ctx.fillRect(Math.round(cdx * tileSize), Math.round(rdx * tileSize), w, h)
          })
        })
        if (image) {
          const img = await this.loadImg(image)
          const x = ((ratioSize - ratioImgSize) / 2).toFixed(2)
          const y = x
          ctx.drawImage(img, x, y, ratioImgSize, ratioImgSize)
        }
      },
      _fixType (type) {
        type = type.toLowerCase().replace(/jpg/i, 'jpeg')
        const r = type.match(/png|jpeg|bmp|gif/)[0]
        return 'image/' + r
      },
      saveImage () {
        const type = 'png'
        const canvas = this.$refs['qrcode-vue']
        const imgData = canvas.toDataURL(type).replace(this._fixType(type), 'image/octet-stream')

        const filename = '二维码_' + (new Date()).getTime() + '.' + type
        const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a')
        saveLink.href = imgData
        saveLink.download = filename

        const event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        saveLink.dispatchEvent(event)
      }
    },
    updated () {
      this.render()
    },
    mounted () {
      this.render()
    }
  }
</script>
