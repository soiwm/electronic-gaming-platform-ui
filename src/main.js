import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/main.css'
import './assets/css/sidebar.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 引入 Font Awesome 图标库
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faGamepad, 
  faUsers, 
  faHome, 
  faBars, 
  faUser, 
  faSignOutAlt 
} from '@fortawesome/free-solid-svg-icons'

// 注册常用图标
library.add(faGamepad, faUsers, faHome, faBars, faUser, faSignOutAlt)

const app = createApp(App)
app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(store)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')