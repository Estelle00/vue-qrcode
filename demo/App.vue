<template>
  <div>
    <har-qrcode text="adasd123" :image="logo"></har-qrcode>
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
