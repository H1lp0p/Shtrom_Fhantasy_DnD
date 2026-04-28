function DataviewItemList({ directory, showExtensions = false }) {
  const [files, setFiles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const dataview = useDataviewApi();

  React.useEffect(() => {
    if (!dataview) {
      setFiles([]);
      setLoading(false);
      return;
    }

    const pages = dataview.pages(`"${directory}"`);
    const fileList = pages.array().map((p) => ({
      name: showExtensions ? p.file.name : p.file.basename ?? p.file.name,
      link: p.file.link,
    }));
    setFiles(fileList);
    setLoading(false);
  }, [directory, showExtensions, dataview]);

  if (loading) return <div>Loading files from {directory}...</div>;
  if (!files.length) return <div>No files found in "{directory}"</div>;

  return (
    <div>
      <input
        type="text"
        list={`file-options-${directory}`}
        placeholder="Select a file..."
        style={{ width: "100%" }}
      />
      <datalist id={`file-options-${directory}`}>
        {files.map((file, index) => (
          <option key={index} value={file.name}></option>
        ))}
      </datalist>
    </div>
  );
}

module.exports = DataviewItemList;
