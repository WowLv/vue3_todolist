import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets'
import 'amfe-flexible'
import Tool from '@/utils/Tool'
import Storage from '@/utils/Storage'

import {
  Icon,
  Cell,
  CellGroup,
  Toast,
  Button,
  SwipeCell,
  Tab,
  Tabs
} from 'vant'

const app = createApp(App)
app.config.globalProperties.$Tool = Tool
app.config.globalProperties.$Storage = Storage

app.use(Icon)
app.use(Cell)
app.use(CellGroup)
app.use(SwipeCell)
app.use(Button)
app.use(Toast)
app.use(Tab)
app.use(Tabs)

app.use(store).use(router).mount('#app')
