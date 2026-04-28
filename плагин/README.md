# Obsidian Jsx

Плагин для рендера React-компонентов из code block-ов в режиме чтения Obsidian.

## Быстрый старт

1. Установите зависимости и соберите плагин:

```bash
npm install
npm run build
```

2. В настройках плагина укажите:

- `Runtime folder` (по умолчанию `.obsidian/jsx-runtime`)
- `Runtime entry file` (по умолчанию `index.js`)

3. Создайте runtime-файл, например `.obsidian/jsx-runtime/index.js`:

```js
function Card(props) {
  return React.createElement(
    "div",
    { style: { border: "1px solid var(--background-modifier-border)", padding: 12 } },
    props.children
  );
}

module.exports = { Card };
```

4. Используйте блоки `react` в заметках:

```react
<h1>Hello, world!</h1>
```

```react
const title = "test"
return <h1>{title}</h1>
```

Для использования хуков удобнее `react-component`:

```react-component
const [count, setCount] = React.useState(0)
return (
  <button onClick={() => setCount((prev) => prev + 1)}>
    Count: {count}
  </button>
)
```

Если хочешь один тип fence-блока, в `react` доступен маркер первой строки `// @component`:

```react
// @component
const [count, setCount] = React.useState(0)
return <button onClick={() => setCount((p) => p + 1)}>{count}</button>
```

```react
return <Card>Runtime component works</Card>
```

## Что уже есть

- Рендер только в режиме чтения (Reading view).
- `react` — прямой JSX/выражения.
- `react-component` — обертка в функцию-компонент (хуки работают из коробки).
- `ctx.useFrontmatterState(key, defaultValue)` — реактивный `useState`-подобный API для frontmatter.
- Прямые хуки в scope: `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useFrontmatterState`, `useDataviewApi`, `useFileText`, `useCreateFile`, `useCreateFileFromTemplate`, модальные хуки.
- `ctx` доступен в блоках: `ctx.file`, `ctx.frontmatter.get/set/subscribe`, `ctx.modal.*`.
- Кнопка `Reload runtime imports` для принудительной очистки кэша и перекомпиляции.
- Тоггл `Trusted execution` для глобального разрешения/запрета исполнения кода.

Полная документация API: [`API.md`](API.md)

## Стилизация в теме Obsidian

Чтобы компоненты выглядели нативно в любой теме:

- Используй CSS-переменные Obsidian:
  - `var(--interactive-accent)` — основной акцентный цвет
  - `var(--text-on-accent)` — текст на акцентном фоне
  - `var(--background-primary-alt)`, `var(--background-modifier-border)` — фон/границы карточек
- Используй стандартные классы Obsidian:
  - `mod-cta` — кнопка основного действия
  - `mod-warning` — предупреждающее действие

Пример:

```jsx
<button className="mod-cta">Основное действие</button>
```

## Разработка

Установить зависимости:

```bash
npm install
```

Режим разработки:

```bash
npm run dev
```

Релизная сборка:

```bash
npm run build
```

---

<sub>Плагин создан через (create-obsidian-plugin)[https://www.npmjs.com/package/create-obsidian-plugin]</sub>
