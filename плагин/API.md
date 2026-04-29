# Runtime API Obsidian JSX

Этот документ описывает API, доступный внутри блоков `react` и `react-component`.

## Режимы блоков

- `react` — прямой JSX/выражения.
- `react-component` — код оборачивается в функцию-компонент (хуки работают из коробки).
- В `react` можно добавить первую непустую строку `// @component`, чтобы принудительно включить компонентный режим.

## Что доступно в scope блока

Каждый блок получает:

- `React` (совместимый слой на базе preact)
- Экспорты runtime из `.obsidian/jsx-runtime/index.js`
- `ctx` (контекст плагина)
- Встроенные компоненты:
  - `Markdown`
- Прямые хуки/функции:
  - `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext`
  - `useFrontmatterState`
  - `useDataviewApi`
  - `useFileText`
  - `useCreateFile`
  - `useCreateFileFromTemplate`
  - `useModal`, `useAlertModal`, `useConfirmModal`, `usePromptModal`, `useBottomSheet`, `useCommandPalette`, `useFormModal`

## Контекст `ctx`

- `ctx.file` -> `{ path, basename, extension } | null`
- `ctx.frontmatter.get(key?)`
- `ctx.frontmatter.set(patch)`
- `ctx.frontmatter.subscribe(listener)`
- `ctx.useFrontmatterState(key, defaultValue)`
- `ctx.useDataviewApi()`
- `ctx.useFileText(path, defaultValue?)`
- `ctx.useCreateFile()`
- `ctx.useCreateFileFromTemplate(builder)`
- `ctx.modal.alert(message)`
- `ctx.modal.confirm(message)`
- `ctx.modal.prompt(options)`
- `ctx.modal.bottomSheet(options)`
- `ctx.modal.commandPalette(options)`
- `ctx.modal.form(options)`

## Справочник по хукам

### `useFrontmatterState(key, defaultValue)`

`useState`-подобный хук для frontmatter текущего файла.

- возвращает `[value, setValue]`
- поддерживает updater-функцию `setValue(prev => next)`
- реактивно синхронизируется через metadata cache
- поддерживает YAML-значения (скаляры, массивы, объекты)

```react-component
const [visits, setVisits] = useFrontmatterState("visits", 0)
return <button onClick={() => setVisits((v) => v + 1)}>Visits: {visits}</button>
```

### `useDataviewApi<T = unknown>()`

Возвращает API Dataview или `null`, если плагин недоступен.

```react-component
const dv = useDataviewApi()
if (!dv) return <em>Dataview не установлен</em>
return <span>Dataview доступен</span>
```

### `useFileText(path, defaultValue?)`

Реактивное чтение текста файла по пути.

Возвращает:

- `content: string`
- `exists: boolean`
- `loading: boolean`
- `error: string | null`
- `refresh(): Promise<void>`

```react-component
const fileState = useFileText("old_test.md", "")
return <pre>{fileState.content.slice(0, 200)}</pre>
```

### `useCreateFile()`

Возвращает функцию создания/обновления файла:

```ts
create({
  dir: string,
  filename: string,
  frontmatter?: Record<string, unknown>,
  content?: string,
  overwrite?: boolean,
  openAfterCreate?: boolean
})
```

Результат:

```ts
{ path: string, created: boolean }
```

### `useCreateFileFromTemplate(builder)`

Шаблонный sugar-хук над `useCreateFile`.

- `builder(vars) => CreateFileInput`
- возвращает функцию `(vars) => Promise<{ path, created }>`

```react-component
const createFromTemplate = useCreateFileFromTemplate((vars) => ({
  dir: "Снаряжение",
  filename: vars.name,
  frontmatter: { тип: "Оружие", урон: vars.damage },
  content: "# " + vars.name,
}))
```

## Модалки

### Два стиля использования

- Единый объект:
  - `const modal = useModal()`
  - `modal.alert(...)`, `modal.confirm(...)`, `modal.prompt(...)`, `modal.bottomSheet(...)`, `modal.commandPalette(...)`, `modal.form(...)`
- Раздельные хуки:
  - `useAlertModal()`, `useConfirmModal()`, `usePromptModal()`, `useBottomSheet()`, `useCommandPalette()`, `useFormModal()`

### `alert(message)`

- вход:
  - `message: string`
- возвращает:
  - `Promise<void>`
- поведение:
  - резолвится после закрытия модалки

```react-component
const alert = useAlertModal()
return <button onClick={() => alert("Сохранено")}>Alert</button>
```

### `confirm(message)`

- вход:
  - `message: string`
- возвращает:
  - `Promise<boolean>`
- поведение:
  - `true` при подтверждении
  - `false` при отмене/закрытии

```react-component
const confirm = useConfirmModal()

async function onClick() {
  const ok = await confirm("Удалить файл?")
  if (ok) {
    // выполнить удаление
  }
}

return <button onClick={onClick}>Confirm</button>
```

### `prompt(options)`

- вход:
  - `title?: string` — заголовок
  - `placeholder?: string` — плейсхолдер
  - `defaultValue?: string` — значение по умолчанию
  - `submitText?: string` — текст кнопки подтверждения
  - `cancelText?: string` — текст кнопки отмены
- возвращает:
  - `Promise<string | null>`
- поведение:
  - строка при submit
  - `null` при cancel/close

```react-component
const prompt = usePromptModal()

async function rename() {
  const value = await prompt({
    title: "Переименовать",
    placeholder: "Новое имя",
    defaultValue: "Item",
    submitText: "Сохранить",
    cancelText: "Отмена",
  })
  if (value !== null) {
    // использовать value
  }
}

return <button onClick={rename}>Prompt</button>
```

### `bottomSheet(options)`

- вход:
  - `title?: string` — заголовок
  - `message?: string` — подсказка
  - `actions: Array<{ id: string; label: string }>` — действия
  - `cancelText?: string` — текст отмены
  - `variant?: "menu" | "datalist"` — режим выбора (`menu` по умолчанию)
  - `placeholder?: string` — плейсхолдер для `variant: "datalist"`
  - `defaultValue?: string` — стартовое значение (`id` или `label`) для `variant: "datalist"`
  - `submitText?: string` — текст кнопки подтверждения для `variant: "datalist"`
- возвращает:
  - `Promise<string | null>`
- поведение:
  - выбранный `id`
  - `null` при cancel/close
- примечание:
  - `variant: "menu"` использует нативный `Menu` Obsidian (mobile-friendly action sheet)
  - `variant: "datalist"` открывает модалку c `input + datalist` для подсказок и поиска

```react-component
const bottomSheet = useBottomSheet()

async function pick() {
  const selected = await bottomSheet({
    title: "Выбери действие",
    message: "Один вариант",
    actions: [
      { id: "equip", label: "Экипировать" },
      { id: "drop", label: "Выбросить" },
    ],
    cancelText: "Отмена",
  })
  // selected: "equip" | "drop" | null
}

return <button onClick={pick}>Bottom sheet</button>
```

Пример с подсказками (`input + datalist`):

```react-component
const bottomSheet = useBottomSheet()

async function pickWithHints() {
  const selected = await bottomSheet({
    title: "Выбери предмет",
    message: "Начни вводить название",
    variant: "datalist",
    placeholder: "Например: Кинжал",
    submitText: "Выбрать",
    cancelText: "Отмена",
    actions: [
      { id: "dagger", label: "Кинжал" },
      { id: "shortsword", label: "Короткий меч" },
      { id: "longbow", label: "Длинный лук" },
    ],
  })
  // selected: "dagger" | "shortsword" | "longbow" | null
}

return <button onClick={pickWithHints}>Bottom sheet datalist</button>
```

### `commandPalette(options)`

Нативная модалка выбора в стиле Command Palette (`Ctrl+P`) на базе `FuzzySuggestModal`.

- вход:
  - `title?: string` — заголовок модалки
  - `placeholder?: string` — текст в строке поиска
  - `emptyStateText?: string` — текст пустого результата
  - `actions: Array<{ id: string; label: string; description?: string }>`
- возвращает:
  - `Promise<string | null>`
- поведение:
  - возвращает `id` выбранного элемента
  - `null` при `Esc`/закрытии

```react-component
const pickCommand = useCommandPalette()

async function openPalette() {
  const selected = await pickCommand({
    title: "Действия профиля",
    placeholder: "Начни вводить...",
    emptyStateText: "Ничего не найдено",
    actions: [
      { id: "add-tag", label: "Add tag", description: "Добавить тег в profile.tags" },
      { id: "toggle-published", label: "Toggle published" },
      { id: "reset-visits", label: "Reset visits to zero" },
    ],
  })
  // selected: "add-tag" | "toggle-published" | "reset-visits" | null
}

return <button onClick={openPalette}>Open command palette</button>
```

### `form(options)`

- вход:
  - `title?: string`
  - `submitText?: string`
  - `cancelText?: string`
  - `fields: FormField[]`
    - `key: string` — ключ в объекте результата
    - `label: string` — подпись поля
    - `type?: "text" | "number"` — тип input
    - `required?: boolean` — обязательность
    - `placeholder?: string`
    - `defaultValue?: string | number`
- возвращает:
  - `Promise<Record<string, string> | null>`
- поведение:
  - объект строковых значений по ключам при submit
  - `null` при cancel/close
  - для `type: "number"` значение всё равно строка (`Number(...)` делай вручную)

```react-component
const openForm = useFormModal()

async function create() {
  const values = await openForm({
    title: "Создать предмет",
    submitText: "Создать",
    cancelText: "Отмена",
    fields: [
      { key: "name", label: "Название", required: true, placeholder: "Кинжал" },
      { key: "damage", label: "Урон", defaultValue: "1d6" },
      { key: "bonus", label: "Бонус атаки", type: "number", defaultValue: 0 },
    ],
  })

  if (!values) return
  const bonus = Number(values.bonus || 0)
  // values.name, values.damage, bonus...
}

return <button onClick={create}>Form modal</button>
```

## Встроенные компоненты

### `Markdown`

Нативный рендер markdown через `MarkdownRenderer` Obsidian.

Props:

- `content?: string`
- `markdown?: string`
- `text?: string`

```react-component
const md = "### Привет\n\n- элемент"
return <Markdown content={md} />
```

## Runtime-импорты

- Entry файл задается в настройках плагина (по умолчанию `.obsidian/jsx-runtime/index.js`).
- Поддерживаются относительные импорты между `.js` и `.jsx`.
- Граф импортов кэшируется; ручной сброс в настройках:
  - `Reload runtime imports`

## Важные замечания

- Исполнение кода управляется настройкой `Trusted execution`.
- Рендер рассчитан на режим чтения.
- Runtime-код считается доверенным/локальным — не запускай неизвестный код.

## Cookbook (готовые рецепты)

### 1) Виджет ресурса (frontmatter + кнопки)

```react-component
const [hp, setHp] = useFrontmatterState("hp_current", 10)
const [hpMax] = useFrontmatterState("hp_max", 10)

function apply(delta) {
  setHp((prev) => Math.max(0, Math.min(prev + delta, hpMax)))
}

return (
  <div style={{ display: "grid", gap: 8 }}>
    <strong>HP: {hp}/{hpMax}</strong>
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={() => apply(-1)}>-1</button>
      <button onClick={() => apply(+1)}>+1</button>
    </div>
  </div>
)
```

### 2) CRUD списка во frontmatter (добавить/удалить)

```react-component
const [items, setItems] = useFrontmatterState("inventory", [])
const prompt = usePromptModal()
const bottomSheet = useBottomSheet()

async function add() {
  const value = await prompt({ title: "Добавить предмет", placeholder: "Название" })
  if (!value) return
  setItems((prev) => (prev.includes(value) ? prev : [...prev, value]))
}

async function remove() {
  if (!items.length) return
  const selected = await bottomSheet({
    title: "Удалить предмет",
    actions: items.map((item, i) => ({ id: String(i), label: item })),
  })
  if (selected === null) return
  const idx = Number(selected)
  setItems((prev) => prev.filter((_, i) => i !== idx))
}

return (
  <div style={{ display: "grid", gap: 8 }}>
    <div>{items.join(", ") || "пусто"}</div>
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={add}>Добавить</button>
      <button onClick={remove}>Удалить</button>
    </div>
  </div>
)
```

### 3) Создание файла снаряжения в `Снаряжение/`

```react-component
const createFromTemplate = useCreateFileFromTemplate((vars) => ({
  dir: "Снаряжение",
  filename: vars.name,
  frontmatter: {
    тип: "Оружие",
    категория: vars.category,
    руки: vars.hands,
    урон: vars.damage,
    свойства: vars.properties,
  },
  content: `# ${vars.name}\n\nСоздано из runtime.`,
  overwrite: false,
}))

async function create() {
  await createFromTemplate({
    name: "Тестовый клинок",
    category: "Колющее",
    hands: "Одна",
    damage: "1d6",
    properties: "Лёгкое",
  })
}

return <button className="mod-cta" onClick={create}>Создать предмет</button>
```

### 4) Чтение текста файла по пути

```react-component
const fileState = useFileText("old_test.md", "")
const preview = fileState.content.slice(0, 240)

return (
  <div style={{ display: "grid", gap: 8 }}>
    <div>exists: {String(fileState.exists)}</div>
    <div>loading: {String(fileState.loading)}</div>
    <div>error: {fileState.error ?? "none"}</div>
    <button onClick={fileState.refresh}>Refresh</button>
    <Markdown content={"```md\n" + preview + "\n```"} />
  </div>
)
```

### 5) Dataview guard pattern

```react-component
const dv = useDataviewApi()
if (!dv) return <em>Dataview плагин недоступен</em>

const pages = dv.pages('"Персонажи"').array()
return (
  <ul>
    {pages.slice(0, 5).map((p) => (
      <li key={p.file.path}>{p.file.name}</li>
    ))}
  </ul>
)
```
