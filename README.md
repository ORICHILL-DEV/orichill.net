# orichill.net

Официальный сайт ORICHILL: главная (`/`), вики (`/wiki/`), документы (`/legal/`), а позже магазин (`/store`).
Онлайн-карта (squaremap, `map.orichill.net`) открывается окном поверх любой страницы, без перехода.
Сайт собирается на [VitePress](https://vitepress.dev) и публикуется через GitHub Pages на **https://www.orichill.net**.

Код: MIT (LICENSE). Тексты: CC BY-NC-SA 4.0, бренд и логотип защищены (LICENSE-CONTENT.md).

## Устройство

```
site/
  index.md                  главная (компонент HomePage)
  wiki/                     вики, перенесена с wiki.orichill.ru
  legal/                    пользовательское соглашение и политика ПД
  public/                   картинки (assets/wiki, img), CNAME
  .vitepress/
    config.mts              меню, поиск, подвал
    sidebar.ts              меню слева для /wiki/ и /legal/ (с иконками)
    icons.ts                иконки Lucide (https://lucide.dev) для меню
    theme/
      components/HomePage.vue   главная
      components/MapModal.vue   окно с картой
      components/WikiHome.vue   главная вики (/wiki/)
      map.ts                    перехват ссылок на карту (#map)
      motion.ts                 плавное раскрытие меню и «Подробнее», появление страниц
      wiki-theme.css            оформление вики
      icons.generated.css       иконки для подсказок (node scripts/gen-icon-css.mjs)
      site.css / wiki.css       оформление
```

Переходы между страницами идут без перезагрузки (SPA), поэтому главная, вики и будущий магазин ощущаются одним сайтом.
Любая ссылка на `https://map.orichill.net/` или `#map` открывает карту в окне; ссылка `https://www.orichill.net/#map` открывает её сразу.

## Как править вики

- Страницы: `site/wiki/**/*.md`. Меню слева: `site/.vitepress/sidebar.ts`, иконка задаётся именем из [lucide.dev](https://lucide.dev/icons), например `i('Swords', 'Навыки')`.
- Картинки: `site/public/assets/wiki/`, в тексте `/assets/wiki/имя.png`.
- Подсказки: `::: info`, `::: tip`, `::: warning`, `::: danger`, закрываются строкой `:::`.
- Цветной текст: `<span class="oc-c-primary">текст</span>` (`primary`, `success`, `warning`, `danger`, `info`, `tint`), фон `oc-bg-*`.

Локально:

```bash
npm ci
npm run dev
```

## Публикация

Push в `main` запускает `.github/workflows/deploy.yml`: сборка и деплой в GitHub Pages. В PR сайт только собирается (проверка).

Разовая настройка:
1. Settings → Pages → Source: **GitHub Actions**.
2. DNS (Cloudflare): `www` CNAME → `orichill-dev.github.io` (серое облако, без прокси, пока GitHub выпускает сертификат).
   Для `orichill.net` без www: A-записи `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`; GitHub сам перенаправит на www.
3. Settings → Pages → Custom domain: `www.orichill.net`, затем **Enforce HTTPS**. Файл `site/public/CNAME` уже есть.
4. Старая вики: в Cloudflare правило перенаправления `wiki.orichill.net/*` → `https://www.orichill.net/wiki/${1}` (301).
   Адреса страниц сохранены, кроме `mechanics/mechanics/*` → `wiki/mechanics/*` и `others/rkn-pidorasi` → `wiki/others/discord-unblock`.
