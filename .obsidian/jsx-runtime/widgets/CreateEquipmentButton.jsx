function CreateEquipmentButton(props) {
  const createFile = useCreateFile();
  const openForm = useFormModal();
  const alert = useAlertModal();
  const [status, setStatus] = useState("idle");

  const targetDir = props.directory ?? "Снаряжение";
  const buttonText = props.buttonText ?? "Создать предмет";

  async function createEquipment() {
    const values = await openForm({
      title: "Создание предмета",
      submitText: "Создать",
      cancelText: "Отмена",
      fields: [
        {
          key: "name",
          label: "Название (обязательно)",
          required: true,
          placeholder: "Кинжал",
        },
        { key: "тип", label: "Тип", placeholder: "Оружие" },
        { key: "категория", label: "Категория", placeholder: "Колющее" },
        { key: "руки", label: "Руки", placeholder: "Одна" },
        { key: "урон", label: "Урон", placeholder: "1d6" },
        { key: "свойство", label: "Свойство", placeholder: "Лёгкое" },
        { key: "дистанция", label: "Дистанция", placeholder: "Ближняя" },
        { key: "описание", label: "Описание", placeholder: "Краткое описание" },
        { key: "бонус_кб", label: "Бонус КБ", type: "number", defaultValue: 0 },
        {
          key: "бонус_атаки",
          label: "Бонус атаки",
          type: "number",
          defaultValue: 0,
        },
      ],
    });

    if (!values) {
      setStatus("cancelled");
      return;
    }

    const name = (values.name ?? "").trim();
    if (!name) {
      setStatus("error: name is required");
      await alert("Название предмета обязательно.");
      return;
    }

    const тип = values["тип"] ?? "";
    const категория = values["категория"] ?? "";
    const руки = values["руки"] ?? "";
    const урон = values["урон"] ?? "";
    const свойство = values["свойство"] ?? "";
    const дистанция = values["дистанция"] ?? "";
    const описание = values["описание"] ?? "";
    const бонусКбRaw = values["бонус_кб"] ?? "0";
    const бонусАтакиRaw = values["бонус_атаки"] ?? "0";

    const бонус_кб = Number.isFinite(Number(бонусКбRaw)) ? Number(бонусКбRaw) : 0;
    const бонус_атаки = Number.isFinite(Number(бонусАтакиRaw))
      ? Number(бонусАтакиRaw)
      : 0;

    const frontmatter = {
      тип,
      категория,
      руки,
      урон,
      свойства: свойство,
      дистанция,
      описание,
      бонус_кб,
      бонус_атаки,
    };

    // Remove empty optional fields from frontmatter payload.
    for (const key of Object.keys(frontmatter)) {
      if (frontmatter[key] === "") {
        delete frontmatter[key];
      }
    }

    const contentLines = [
      `# ${name}`,
      "",
      "| Свойство | Значение |",
      "|----------|----------|",
      `| Тип | ${тип || "-"} |`,
      `| Категория | ${категория || "-"} |`,
      `| Руки | ${руки || "-"} |`,
      `| Урон | ${урон || "-"} |`,
      `| Свойства | ${свойство || "-"} |`,
      `| Дистанция | ${дистанция || "-"} |`,
      `| Бонус КБ | ${бонус_кб || 0} |`,
      `| Бонус атаки | ${бонус_атаки || 0} |`,
    ];

    try {
      const result = await createFile({
        dir: targetDir,
        filename: name,
        frontmatter,
        content: contentLines.join("\n"),
        overwrite: false,
        openAfterCreate: false,
      });
      setStatus(`created: ${result.path}`);
      await alert(`Предмет создан: ${result.path}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus(`error: ${message}`);
      await alert(`Ошибка создания: ${message}`);
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button className="mod-cta" onClick={createEquipment}>
        {buttonText}
      </button>
      <small>status: {status}</small>
    </div>
  );
}

module.exports = CreateEquipmentButton;
