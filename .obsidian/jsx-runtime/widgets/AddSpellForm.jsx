function AddSpellForm(props) {
    const directory = props.directory ?? "Способности";
    const listFMKey = props.listFMKey ?? "способности_выбранные";
    const [files, setFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [selectedItem, setSelectedItem] = React.useState("");
    const [active, setActive] = React.useState(false);
    const [selectedFiles, setSelectedFiles] = useFrontmatterState(listFMKey, []);

    const [currentAP, setAP] = useFrontmatterState("очки_способностей_всего", 0);

    const dataview = useDataviewApi();
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedItem) return;

      const selectedFile = files.filter((f) => f.name.includes(selectedItem))[0];
      
      const ok = await confirm(`Добавить способность ${selectedFile.name}? Это будет стоить ${selectedFile.AP} ОС`)

      if (ok){

        if (selectedFile.AP > currentAP) {
            setSelectedItem("");
            alert("Недостаточно OC");
            return
          }

        setAP(prev => prev - selectedFile.AP);
        setSelectedFiles((prev) =>
            prev.includes(selectedItem) ? prev : [...prev, selectedItem]
        );
        setSelectedItem("");
      }

    };

    const handleUpdate = (value) => {
        setSelectedItem(value)
        setActive(!(files.filter(f => f.name === selectedItem).length > 0))
    }
    
    if (loading) return <div>Loading files from {directory}...</div>;
    if (!files.length) return <div>No files found in "{directory}"</div>;
  
    return (
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "row", gap: "8px", width: "100%" }}
      >
        <input
          type="text"
          list={`file-options-${directory}`}
          placeholder="Select a file..."
          value={selectedItem}
          onChange={(e) => handleUpdate(e.target.value)}
          style={{ flex: 1 }}
        />
        <button 
            type="submit"
            disabled={!active}
        >
            Добавить
        </button>

        <datalist id={`file-options-${directory}`}>
          {files
            .filter((file) => !selectedFiles.includes(file.name))
            .map((file, index) => (
              <option key={index} value={file.name}></option>
            ))}
        </datalist>
      </form>
    );
  }
  
  module.exports = AddSpellForm;
  