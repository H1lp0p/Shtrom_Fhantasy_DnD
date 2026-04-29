const defaultProps = {
  directory: "",
  listFMKey: "",
  paletteTitle: "",
  palettePlaceholder: "",
  style: {},
}

function AddFileToFMForm(props) {
  const directory = props.directory ?? "Characters";
  const listFMKey = props.listFMKey ?? "selected_file";
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const [selectedFiles, setSelectedFiles] = useFrontmatterState(listFMKey, []);
  
  const dataview = useDataviewApi();
  const palette = useCommandPalette();

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

  const handleAdd = async () => {
    
    const result = await palette({
      title: props.paletteTitle ?? "Выберите компонент",
      placeholder: props.palettePlaceholder ?? "Введите название...",
      actions: files
          .filter((file) => !selectedFiles.includes(file.name))
          .map((file) => {
            return {
              id: file.name,
              label: file.name,
            }})
    })

    if (result) {
      setSelectedFiles(prev => [...prev, result])
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

module.exports = AddFileToFMForm;
