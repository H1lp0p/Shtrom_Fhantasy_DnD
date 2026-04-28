---
visits: 1
published: false
profile:
  name: H1l_p0p
  tags:
    - mobile
    - react
    - tag-3
    - tag-4
    - tag-5
---

# Obsidian JSX test playground

## 1) Simple JSX block
```react
<h1>Hello, world!</h1>
```

## 2) Hook mode in `react-component`
```react-component
const [count, setCount] = useState(0)
return (
  <div style={{display: "flex", width: "100%", gap: "16px", alignItems: "center"}}>
    <span>Counter: {count}</span>
    <button onClick={() => setCount((prev) => prev + 1)}>+1</button>
    <button onClick={() => setCount(0)}>Reset</button>
  </div>
)
```

## 3) Hook mode with `react` + marker (`// @component`)
```react
// @component
const [name, setName] = useState("Obsidian")
return (
  <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
    <input value={name} onChange={(e) => setName(e.target.value)} />
    <strong>Hello, {name}!</strong>
  </div>
)
```

## 4) Runtime components from `.obsidian/jsx-runtime/index.js`
```react
return (
  <Stack gap={12}>
    <Card>
      <h3 style={{marginTop: 0}}>Runtime card</h3>
      <p style={{marginBottom: 0}}>Card component comes from runtime file.</p>
    </Card>
    <TestCard title="Imported from test.jsx" description="ESM import/export in runtime works." />
    <div style={{display: "flex", gap: "8px"}}>
      <Badge>alpha</Badge>
      <Badge>mobile</Badge>
      <Badge>test</Badge>
    </div>
  </Stack>
)
```

## 5) Frontmatter read/write + modal
```react-component
const [value, setValue] = useFrontmatterState("visits", 0)
const [profile, setProfile] = useFrontmatterState("profile", {
  name: "Sasha",
  tags: ["mobile", "react"],
})
const [published, setPublished] = useFrontmatterState("published", false)
const [lastAction, setLastAction] = useState("none")
const modal = useModal()
const prompt = usePromptModal()
const bottomSheet = useBottomSheet()
const dataview = useDataviewApi()

async function save() {
  await modal.alert("Frontmatter synced reactively")
}

async function runPrompt() {
  const nextName = await prompt({
    title: "Update profile name",
    placeholder: "Enter new name",
    defaultValue: profile.name,
    submitText: "Save",
  })
  if (nextName) {
    await setProfile((prev) => ({ ...prev, name: nextName }))
    setLastAction("prompt")
  }
}

async function runSheet() {
  const selected = await bottomSheet({
    title: "Profile actions",
    message: "Pick one action",
    actions: [
      { id: "add-tag", label: "Add tag" },
      { id: "toggle-published", label: "Toggle published" },
      { id: "reset-visits", label: "Reset visits" },
    ],
  })
  if (selected === "add-tag") {
    await setProfile((prev) => ({
      ...prev,
      tags: [...prev.tags, "tag-" + (prev.tags.length + 1)],
    }))
  } else if (selected === "toggle-published") {
    await setPublished((p) => !p)
  } else if (selected === "reset-visits") {
    await setValue(0)
  }
  if (selected) setLastAction(selected)
}

return (
  <div style={{display: "grid", gap: "8px"}}>
    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
      <span>Dataview API: {dataview ? "available" : "not found"}</span>
      <span>Last action: {lastAction}</span>
    </div>
    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
      <span>Visits: {value}</span>
      <button onClick={() => setValue((v) => v + 1)}>+1</button>
      <button onClick={() => setValue(0)}>Reset</button>
    </div>
    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
      <span>Published: {String(published)}</span>
      <button onClick={() => setPublished((p) => !p)}>Toggle</button>
    </div>
    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
      <span>Profile: {profile.name} / {profile.tags.join(", ")}</span>
      <button
        onClick={() =>
          setProfile((prev) => ({
            ...prev,
            tags: [...prev.tags, "tag-" + (prev.tags.length + 1)],
          }))
        }
      >
        Add tag
      </button>
      <button onClick={runPrompt}>Rename (prompt)</button>
    </div>
    <div style={{display: "flex", gap: "8px", alignItems: "center"}}>
      <button onClick={save}>Show alert</button>
      <button onClick={runSheet}>Show bottom sheet</button>
    </div>
  </div>
)
```

## 6) Built-in Markdown component
```react-component
const md = [
  "### Rendered by Obsidian",
  "",
  "- native markdown renderer",
  "- supports **bold**, ==highlight==, [[links]]",
].join("\n")

return <Markdown content={md} />
```

## 7) Migrated Widgets
```react
return (
  <Stack gap={12}>
    <Card>
      <h4 style={{ marginTop: 0 }}>PointsWidget</h4>
      <PointsWidget
        title="HP"
        currentPointKey="visits"
        attributeKey="visits"
        calculation="${attribute} + 10"
      />
    </Card>
    <Card>
      <h4 style={{ marginTop: 0 }}>AttributeWithBar</h4>
      <AttributeWithBar
        title="Resource"
        minAmountFMKey="resource_min"
        maxAmountFMKey="resource_max"
        storedAmountFMKey="resource_cur"
        minValue={0}
        maxValue={20}
      />
    </Card>
    <Card>
      <h4 style={{ marginTop: 0 }}>DataviewItemList + AddFileToFMForm</h4>
      <DataviewItemList directory="Персонажи" />
      <div style={{ marginTop: 8 }}>
        <AddFileToFMForm directory="Персонажи" listFMKey="selected_file" />
        <div style={{ marginTop: 8 }}>
          <RemoveFromFMListButton
            listFMKey="selected_file"
            title="Удалить из selected_file"
            emptyMessage="В selected_file пока нет элементов"
          />
        </div>
      </div>
    </Card>
  </Stack>
)
```

## 8) File text hook (`useFileText`)
```react-component
const fileState = useFileText("old_test.md", "")
const preview = fileState.content.slice(0, 220)

return (
  <Card>
    <h4 style={{ marginTop: 0 }}>useFileText demo</h4>
    <div>exists: {String(fileState.exists)}</div>
    <div>loading: {String(fileState.loading)}</div>
    <div>error: {fileState.error ?? "none"}</div>
    <button onClick={fileState.refresh}>Refresh</button>
    <Markdown content={"```md\n" + preview + "\n```"} />
  </Card>
)
```

## 9) Create file hooks (`useCreateFile`, `useCreateFileFromTemplate`)
```react-component
const createFile = useCreateFile()
const fromTemplate = useCreateFileFromTemplate((vars) => ({
  dir: "Снаряжение",
  filename: vars.name,
  frontmatter: {
    тип: "Оружие",
    категория: vars.category,
    руки: vars.hands,
    урон: vars.damage,
    свойства: vars.properties,
  },
  content: [
    `# ${vars.name}`,
    "",
    "| Свойство | Значение |",
    "|----------|----------|",
    `| Тип | ${vars.category} |`,
    `| Руки | ${vars.hands} |`,
    `| Урон | ${vars.damage} |`,
    `| Свойства | ${vars.properties} |`,
    "",
    "## Описание",
    "",
    vars.description,
  ].join("\n"),
  overwrite: false,
  openAfterCreate: false,
}))

const [name, setName] = useState("Тестовый клинок")
const [status, setStatus] = useState("idle")

async function createSimple() {
  try {
    const result = await createFile({
      dir: "Снаряжение",
      filename: "Черновик предмета",
      frontmatter: { тип: "Оружие", урон: "1d6", свойства: "Тест" },
      content: "# Черновик предмета\n\nСоздан через useCreateFile.",
      overwrite: false,
    })
    setStatus("created: " + result.path)
  } catch (e) {
    setStatus("error: " + String(e))
  }
}

async function createWeapon() {
  try {
    const result = await fromTemplate({
      name,
      category: "Колющее",
      hands: "Одна",
      damage: "1d8",
      properties: "Лёгкое",
      description: "Сгенерировано через useCreateFileFromTemplate.",
    })
    setStatus("created by template: " + result.path)
  } catch (e) {
    setStatus("error: " + String(e))
  }
}

return (
  <Card>
    <h4 style={{ marginTop: 0 }}>Create equipment in /Снаряжение</h4>
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button className="mod-cta" onClick={createWeapon}>Create by template</button>
      <button onClick={createSimple}>Create simple</button>
    </div>
    <div style={{ marginTop: 8 }}>status: {status}</div>
  </Card>
)
```

## 10) Create equipment widget (runtime component)
```react
return (
  <Card>
    <h4 style={{ marginTop: 0 }}>CreateEquipmentButton</h4>
    <CreateEquipmentButton
      directory="Снаряжение"
      buttonText="Создать предмет (модалка)"
    />
  </Card>
)
```

```react
<TestCard title={"Hello"} description={"desc"}/>
```