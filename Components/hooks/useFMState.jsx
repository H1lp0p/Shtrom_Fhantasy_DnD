import { useEmeraContext } from 'emera';
import React from 'react';

const useFMState = (key, defaultValue = null) => {
    const { frontmatter, file, app } = useEmeraContext();
    
    // Локальное состояние
    const [state, setState] = React.useState(() => {
        const value = frontmatter?.[key];
        return value !== undefined && value !== null ? value : defaultValue;
    });
    
    // Подписка на изменения метаданных файла
    React.useEffect(() => {
        if (!file || !app) return;
        
        // Функция, которая будет вызываться при изменении metadata
        const handleMetadataChange = () => {
            const newFrontmatter = app.metadataCache.getFrontmatter(file);
            const newValue = newFrontmatter?.[key];
            
            if (newValue !== undefined && newValue !== null && newValue !== state) {
                setState(newValue);
            }
        };
        
        // Подписываемся на событие изменения метаданных
        app.metadataCache.on('changed', handleMetadataChange);
        
        // Отписка при размонтировании
        return () => {
            app.metadataCache.off('changed', handleMetadataChange);
        };
    }, [file, app, key, state]);
    
    const setFrontmatterState = React.useCallback(async (newValue) => {
        const valueToSet = typeof newValue === 'function' ? newValue(state) : newValue;
        
        // Мгновенно обновляем локальное состояние
        setState(valueToSet);
        
        // Сохраняем в frontmatter
        if (file && app) {
            try {
                await app.fileManager.processFrontMatter(file, (fm) => {
                    if (valueToSet === null || valueToSet === undefined) {
                        delete fm[key];
                    } else {
                        fm[key] = valueToSet;
                    }
                });
            } catch (error) {
                console.error(`Failed to update frontmatter key "${key}":`, error);
                // Откат при ошибке
                const fallbackValue = app.metadataCache.getFrontmatter(file)?.[key] ?? defaultValue;
                setState(fallbackValue);
            }
        }
    }, [key, state, file, app, defaultValue]);
    
    return [state, setFrontmatterState];
};

export default useFMState;