import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import { installMapLinks } from './map'
import './wiki.css'
import './site.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    if (typeof window !== 'undefined') installMapLinks()
  },
} satisfies Theme
