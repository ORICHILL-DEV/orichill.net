import type { DefaultTheme } from 'vitepress'
import { withIcon as i } from './icons'

const legal: DefaultTheme.SidebarItem[] = [
  { text: i('Handshake', 'Пользовательское соглашение'), link: '/legal/user_agreement' },
  { text: i('ShieldCheck', 'Политика обработки персональных данных'), link: '/legal/privacy_policy' },
  { text: i('Landmark', 'Для государственных органов'), link: '/legal/authorities' },
]

const wiki: DefaultTheme.SidebarItem[] = [
  { text: i('House', 'Добро пожаловать'), link: '/wiki/' },
  {
    text: i('BookOpen', 'Основное'),
    collapsed: false,
    items: [
      { text: i('Info', 'Информация'), link: '/wiki/main/info' },
      { text: i('ScrollText', 'Общие правила'), link: '/wiki/main/rules' },
      { text: i('Terminal', 'Команды'), link: '/wiki/main/all-commands' },
      { text: i('CircleHelp', 'Частые вопросы (FAQ)'), link: '/wiki/main/faq' },
    ],
  },
  {
    text: i('Sparkles', 'Игровые механики'),
    collapsed: false,
    items: [
      { text: i('LayoutGrid', 'Обзор механик'), link: '/wiki/mechanics/' },
      { text: i('Shield', 'Защита территории'), link: '/wiki/mechanics/protection-private-territory-docs' },
      { text: i('Lock', 'Защита ЛВ'), link: '/wiki/mechanics/protect-chest' },
      {
        text: i('Swords', 'Развитие персонажа'),
        collapsed: false,
        items: [
          { text: i('Flame', 'Навыки'), link: '/wiki/mechanics/skills' },
          { text: i('Crown', 'Ранги'), link: '/wiki/mechanics/ranks' },
          { text: i('Gem', 'Привилегии'), link: '/wiki/mechanics/group' },
          { text: i('Scroll', 'Квесты'), link: '/wiki/mechanics/kvesty' },
        ],
      },
      {
        text: i('Hammer', 'Крафты и предметы'),
        collapsed: false,
        items: [
          { text: i('WandSparkles', 'Кастомные зачарования'), link: '/wiki/mechanics/custom-enchants' },
          { text: i('Hammer', 'Кастомные крафты'), link: '/wiki/mechanics/custom-crafts' },
          { text: i('Pickaxe', 'Доп. предметы под шаблоны'), link: '/wiki/mechanics/dop.-predmety-pod-shablony' },
          { text: i('Crosshair', 'Шаблоны: луки и арбалеты'), link: '/wiki/mechanics/dop.-predmety-pod-shablony-1' },
          { text: i('Beer', 'Пивоварня'), link: '/wiki/mechanics/bear' },
          { text: i('CookingPot', 'Новая готовка'), link: '/wiki/mechanics/novaya-gotovka' },
          { text: i('Armchair', 'Декоративные модели'), link: '/wiki/mechanics/dekorate-model' },
          { text: i('Signpost', 'Интерактивные таблички'), link: '/wiki/mechanics/znaks' },
        ],
      },
      {
        text: i('Compass', 'Мир и выживание'),
        collapsed: false,
        items: [
          { text: i('Snowflake', 'Сезоны и температура'), link: '/wiki/mechanics/seasons-and-temperature' },
          { text: i('Droplet', 'Жажда'), link: '/wiki/mechanics/zhazhda' },
          { text: i('Skull', 'Мобы Эндер Мира'), link: '/wiki/mechanics/cmem' },
          { text: i('Castle', 'Новые данжи'), link: '/wiki/mechanics/new-dungeons' },
          { text: i('Coins', 'Торговля с пиглинами'), link: '/wiki/mechanics/izmenyonnyi-balans-torgovli-s-piglinami' },
        ],
      },
      {
        text: i('MessagesSquare', 'Общение'),
        collapsed: false,
        items: [
          { text: i('MessagesSquare', 'Чаты'), link: '/wiki/mechanics/chat' },
          { text: i('Mic', 'Голосовой чат'), link: '/wiki/mechanics/voice-chat' },
          { text: i('Smile', 'Emotecraft'), link: '/wiki/mechanics/emotecraft_installing' },
        ],
      },
    ],
  },
  {
    text: i('VenetianMask', 'Role play'),
    collapsed: false,
    items: [{ text: i('Theater', 'Общая информация про RP'), link: '/wiki/rp/info' }],
  },
  {
    text: i('Ellipsis', 'Прочее'),
    collapsed: false,
    items: [
      { text: i('Heart', 'Поддержка проекта'), link: '/wiki/others/donate' },
      { text: i('Video', 'Контентмейкерам'), link: '/wiki/others/content-maker-info' },
      { text: i('Cpu', 'Адаптация механизмов'), link: '/wiki/others/adaptaciya-mekhanizmov' },
      { text: i('Wifi', 'Подключение с Raknetify'), link: '/wiki/others/raknetify' },
    ],
  },
  { text: i('FileText', 'Документы'), collapsed: false, items: legal },
]

export default {
  '/wiki/': wiki,
  '/legal/': [{ text: i('FileText', 'Документы'), items: legal }],
} satisfies DefaultTheme.Sidebar
