function AddSpellForm(props) {
    const directory = props.directory ?? "Способности";
    const listFMKey = props.listFMKey ?? "способности_выбранные";
    const [files, setFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [active, setActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = useFrontmatterState(listFMKey, []);

    const [currentAP, setAP] = useFrontmatterState("очки_способностей_всего", 0);

    const dataview = useDataviewApi();
    const palette = useCommandPalette();
    const confirm = useConfirmModal();
    const alert = useAlertModal();
  
    React.useEffect(() => {
      if (!dataview) {
        setFiles([]);
        setLoading(false);
        return;
      }
  
      const pages = dataview.pages(`"${directory}"`);
      const fileList = pages.array().map((p) => ({
        name: p.file.name,
        link: p.file.link,
        AP: p["стоимость_ос"] ?? null
      }));
      setFiles(fileList);
      setLoading(false);
    }, [directory, listFMKey, dataview]);

    const handleAdd = async () => {      
      const result = await palette({
        title: `Добавить способность? У вас сейчас [${currentAP}] ОС`,
        placeholder: "Выберите способность...",
        actions: files
          .filter((file) => (!selectedFiles || !selectedFiles.includes(file.name)) )
          .map((file) => {
            return {
              id: file.name,
              label: `${file.name} - ${file.AP} ОС`,
            }
          })
      });

      
      if (result) {
        const file = files.find((f) => f.name === result)

        const ok = await confirm(`Добавить способность [${file.name}] стоимостью ${file.AP}?`)

        if (ok) {
          if (currentAP < file.AP){
            alert("недостаточно ОС!")
            return;
          }
          setAP(prev => prev - file.AP)
          setSelectedFiles(prev => (prev) ? [...prev, result] : [result])
        }
      }

    };
  
    return (
      <button 
      onClick={() => {handleAdd()}}
      style={{...props.style}}
      disabled={loading}
    >
      {(!loading && files.length) && "Добавить"}
      {loading && "Загрузка..."}
      {!files.length && "Не удалось загрузить файлы :("}
    </button>
    );
  }
  
  module.exports = AddSpellForm;
  