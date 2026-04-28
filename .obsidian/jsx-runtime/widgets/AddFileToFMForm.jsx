function AddFileToFMForm(props) {
  const directory = props.directory ?? "Characters";
  const listFMKey = props.listFMKey ?? "selected_file";
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState("");

  const [selectedFiles, setSelectedFiles] = useFrontmatterState(listFMKey, []);
  
  const dataview = useDataviewApi();
  const confirm = useConfirmModal();

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
    }));
    setFiles(fileList);
    setLoading(false);
  }, [directory, listFMKey, dataview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    const selectedFile = files.filter((f) => f.name.includes(selectedItem))[0];
      
    const ok = await confirm(`Добавить предмет ${selectedFile.name}?`)

    if (ok) {
      setSelectedFiles((prev) =>
        prev.includes(selectedItem) ? prev : [...prev, selectedItem]
      ); 
    }
    setSelectedItem(""); 
  };

  const handleUpdate = (value) => {
    setSelectedItem(value)
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

module.exports = AddFileToFMForm;
