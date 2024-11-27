import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { createHead } from '@vueuse/head'
import Toast, { type PluginOptions, POSITION } from 'vue-toastification'
import VueApexCharts from 'vue3-apexcharts'
import App from './App.vue'
import router from './router'
import Notifications from '@kyvg/vue3-notification'
import messages from '@intlify/unplugin-vue-i18n/messages'
import { VueQueryPlugin } from '@tanstack/vue-query' // Do we use Vue query? there is nowhere we used useQuery. Potentially remove for performance
import { registerLicense } from '@syncfusion/ej2-base'
import { Buffer } from 'buffer'
import { install } from 'vue3-recaptcha-v2'
import VueLazyload from 'vue-lazyload'
import { createI18n } from 'vue-i18n'
import LoadImage from './assets/loading.gif'
import ErrorImage from './assets/error.svg'
import Vue3SocialSharingPlugin from 'vue3-social-sharing';
import 'vue-toastification/dist/index.css'
import '@vuepic/vue-datepicker/dist/main.css'

if (typeof global === 'undefined') {
  ;(window as any).global = window
}
;(window as any).Buffer = Buffer

const app = createApp(App)

const pinia = createPinia()

const googleRecaptchaV2SiteKey = import.meta.env.VITE_GOOGLE_RECAPTCHA_V2_SITE_KEY || ''
const head = createHead()
const toastOptions: PluginOptions = {
  timeout: 3000,
  position: POSITION.BOTTOM_RIGHT,
  toastClassName: ['border-[#FF90464D]', 'border-[1px]', 'bg-notification']
}

const i18n = createI18n({
  fallbackLocale: 'en',
  locale: 'en',
  messages
})

app.use(pinia)
pinia.use(createPersistedState({}))

app.use(router)
app.use(Notifications)
app.use(head)
app.use(VueQueryPlugin)
app.use(VueApexCharts)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: ErrorImage,
  loading: LoadImage,
  attempt: 1
})
app.use(install, {
  sitekey: googleRecaptchaV2SiteKey
})
app.use(Toast, toastOptions)
app.use(Vue3SocialSharingPlugin)
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhAYVJpR2Nbe05zflRBal1ZVAciSV9jS3pTfkVhWXxfd3ZVR2heUg=='
)
app.use(i18n)
app.mount('#app')
