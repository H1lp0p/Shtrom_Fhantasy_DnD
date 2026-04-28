import { useEmeraContext } from 'emera';
import React from 'react';

const DataviewItemList = ({ directory, showExtensions = false }) => {
    const { app } = useEmeraContext();
    const [files, setFiles] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const loadFiles = () => {
            const dataview = app.plugins.plugins.dataview?.api;
            if (dataview) {
                // Получаем данные из папки "DirectoryName"
                // Обратите внимание на двойные кавычки внутри!
                const pages = dataview.pages(`"${directory}"`);
                
                // Преобразуем результат
                const fileList = pages.array().map(p => ({
                    name: p.file.name,
                    link: p.file.link
                }));
                setFiles(fileList);
            }
            setLoading(false);
        };

        loadFiles();
    }, [app, directory, showExtensions]);

    if (loading) {
        return <div>Loading files from {directory}...</div>;
    }

    if (files.length === 0) {
        return <div>No files found in "{directory}"</div>;
    }

    return (
        <div>
            <input type="text" list="file-options" placeholder="Select a file..." style={{ width: '100%' }} />
            <datalist id="file-options" style={{ listStyle: 'none', padding: 0 }}>
                {files.map((file, index) => (
                    <option key={index} value={file.name}></option>
                ))}
            </datalist>
        </div>
    );
};

export default DataviewItemList;