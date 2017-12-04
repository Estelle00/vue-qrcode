<template>
  <div>
    <har-qrcode text="adasd123" :image="logo" :size="112" :imageSize="30"></har-qrcode>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import HarQrcode from 'har-qrcode'
  import logo from './logo.jpg'
  export default {
    components: {HarQrcode},
    data () {
      return {
        logo
      }
    }
  }
</script>
