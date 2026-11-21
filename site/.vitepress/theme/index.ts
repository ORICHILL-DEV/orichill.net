import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import { installFrameLinks } from './frames'
import { installMotion } from './motion'
import WikiHome from './components/WikiHome.vue'
import StoreFrame from './components/StoreFrame.vue'
import './wiki.css'
import './icons.generated.css'
import './site.css'
import './wiki-theme.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('WikiHome', WikiHome)
    app.component('StoreFrame', StoreFrame)
    if (typeof window !== 'undefined') {
      installFrameLinks()
      installMotion()
    }
  },
} satisfies Theme
