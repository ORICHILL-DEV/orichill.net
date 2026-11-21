import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import sidebar from './sidebar'
import { withIcon as i } from './icons'

const SITE = 'https://www.orichill.net'

export default defineConfig({
  lang: 'ru-RU',
  title: 'ORICHILL',
  titleTemplate: ':title · ORICHILL',
  description: 'ORICHILL: хардкорное ванильное выживание Minecraft с PvE, RPG и полу-RP.',
  cleanUrls: true,
  lastUpdated: true,
  sitemap: { hostname: SITE },
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/img/logo.png' }],
    ['meta', { name: 'theme-color', content: '#6000d4' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ORICHILL' }],
    ['meta', { property: 'og:image', content: `${SITE}/img/cover.webp` }],
  ],
  markdown: {
    config: (md) => md.use(footnote),
    container: {
      tipLabel: 'Совет',
      warningLabel: 'Внимание',
      dangerLabel: 'Важно',
      infoLabel: 'Информация',
      detailsLabel: 'Подробнее',
    },
  },
  themeConfig: {
    logo: '/img/logo.png',
    siteTitle: 'ORICHILL',
    nav: [
      { text: i('House', 'Главная'), link: '/' },
      { text: i('BookOpen', 'Вики'), link: '/wiki/', activeMatch: '^/wiki/' },
      { text: i('ScrollText', 'Правила'), link: '/wiki/main/rules' },
      // ссылка на карту перехватывается темой и открывает окно поверх страницы
      { text: i('Map', 'Карта'), link: 'https://map.orichill.net/', target: '_self' },
      { text: i('ShoppingBag', 'Магазин'), link: 'https://store.orichill.net/' },
    ],
    sidebar,
    socialLinks: [
      { icon: 'discord', link: 'https://discord.orichill.net/', ariaLabel: 'Discord' },
      { icon: 'telegram', link: 'https://t.me/orichill', ariaLabel: 'Telegram' },
      { icon: 'vk', link: 'https://vk.com/orichill', ariaLabel: 'ВКонтакте' },
    ],
    footer: {
      message:
        '<a href="/legal/user_agreement">Пользовательское соглашение</a> · <a href="/legal/privacy_policy">Политика обработки персональных данных</a><br>Не является официальным продуктом Minecraft. Не одобрено и не связано с Mojang или Microsoft.',
      copyright: '© ORICHILL',
    },
    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: 'Поиск', buttonAriaLabel: 'Поиск' },
          modal: {
            noResultsText: 'Ничего не найдено',
            resetButtonTitle: 'Сбросить',
            footer: { selectText: 'выбрать', navigateText: 'перейти', closeText: 'закрыть' },
          },
        },
      },
    },
    outline: { label: 'На этой странице', level: [2, 3] },
    docFooter: { prev: 'Назад', next: 'Далее' },
    lastUpdated: { text: 'Обновлено' },
    notFound: {
      title: 'Страница не найдена',
      quote: 'Похоже, эту часть мира ещё не сгенерировали.',
      linkLabel: 'На главную',
      linkText: 'На главную',
    },
    darkModeSwitchLabel: 'Тема',
    lightModeSwitchTitle: 'Светлая тема',
    darkModeSwitchTitle: 'Тёмная тема',
    sidebarMenuLabel: 'Меню',
    returnToTopLabel: 'Наверх',
    langMenuLabel: 'Язык',
    externalLinkIcon: true,
  },
})
