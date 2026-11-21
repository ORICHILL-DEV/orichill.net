import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import { installMapLinks } from './map'
import { installMotion } from './motion'
import WikiHome from './components/WikiHome.vue'
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
    if (typeof window !== 'undefined') {
      installMapLinks()
      installMotion()
    }
  },
} satisfies Theme
