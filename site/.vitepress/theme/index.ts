import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import WikiHome from './components/WikiHome.vue'
import StoreFrame from './components/StoreFrame.vue'
import { installFrameLinks } from './lib/frames'
import { installMotion } from './lib/motion'
import { installToasts } from './lib/toast'
import { installSearchPanel } from './lib/search-panel'

import '@fontsource-variable/unbounded'
import '@fontsource-variable/jetbrains-mono'
import './styles/tokens.css'
import './styles/icons.generated.css'
import './styles/base.css'
import './styles/home.css'
import './styles/wiki.css'
import './styles/search.css'
import './styles/frames.css'
import './styles/toasts.css'

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
      installToasts()
      installSearchPanel()
    }
  },
} satisfies Theme
