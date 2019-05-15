<template>
  <div>
    <vue-qr-code
      text="123456"
      :logo="logo"
      :size="100"
      :logo-Size="35"
    ></vue-qr-code>
  </div>
</template>
<script>
import VueQrCode from "./components/index";
import logo from "./assets/logo.png";
export default {
  components: { VueQrCode },
  data() {
    return {
      logo
    };
  }
};
</script>
