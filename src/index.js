/**
 * Created by liubingwen on 2017/10/18.
 */
import HarQrcode from 'components/index'
function install (Vue) {
  Vue.components(HarQrcode.name, HarQrcode)
}
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}
export {
  HarQrcode
}
export default install
