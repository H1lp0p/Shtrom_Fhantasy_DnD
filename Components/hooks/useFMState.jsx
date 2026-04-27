import { useEmeraContext } from 'emera';
import React from 'react';

const useFMState = (key, defaultValue = null) => {
    const { frontmatter: initialFrontmatter, file, app } = useEmeraContext();
    
    // Функция для получения актуального frontmatter
    const getCurrentFrontmatter = React.useCallback(() => {
        if (!file || !app) return initialFrontmatter;
        
        // Пробуем оба способа для совместимости
        const cache = app.metadataCache.getFileCache?.(file) || app.metadataCache.getCache?.(file);
        return cache?.frontmatter || initialFrontmatter;
    }, [file, app, initialFrontmatter]);
    
    const [state, setState] = React.useState(() => {
        const currentFm = getCurrentFrontmatter();
        const value = currentFm?.[key];
        return value !== undefined && value !== null ? value : defaultValue;
    });

    // Функция для синхронизации
    const syncWithFrontmatter = React.useCallback(() => {
        const currentFm = getCurrentFrontmatter();
        const newValue = currentFm?.[key];
        
        if (newValue !== undefined && newValue !== null && newValue !== state) {
            console.log(`Syncing key "${key}": ${state} -> ${newValue}`);
            setState(newValue);
        }
    }, [key, state, getCurrentFrontmatter]);

    // Регулярная проверка (для ручных изменений)
    React.useEffect(() => {
        if (!file || !app) return;
        
        const interval = setInterval(() => {
            syncWithFrontmatter();
        }, 200);
        
        return () => clearInterval(interval);
    }, [file, app, syncWithFrontmatter]);

    const setFrontmatterState = React.useCallback(async (newValue) => {
        const valueToSet = typeof newValue === 'function' ? newValue(state) : newValue;
        
        // Мгновенно обновляем UI
        setState(valueToSet);
        
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
                syncWithFrontmatter();
            }
        }
    }, [key, state, file, app, syncWithFrontmatter]);

    return [state, setFrontmatterState];
};

export default useFMState;