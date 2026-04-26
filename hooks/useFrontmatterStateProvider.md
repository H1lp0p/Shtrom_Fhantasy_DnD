---
defines-react-components: true
react-components-namespace:
---

```jsx:component:useFrontmatterStateProvider
// Кастомный хук для работы с frontmatter как с состоянием
const useFrontmatterState = (key, defaultValue = null) => {
  const ctx = React.useContext(ReactComponentContext);
  const file = ctx.markdownPostProcessorContext.file;
  const app = ctx.app;
  
  // Получаем текущее значение из frontmatter
  const frontmatter = ctx.markdownPostProcessorContext.frontmatter;
  const initialValue = frontmatter?.[key] ?? defaultValue;
  
  const [state, setState] = React.useState(initialValue);
  
  // Функция для обновления frontmatter без полного перерендера
  const updateFrontmatter = React.useCallback(async (newValue) => {
    if (!file) return;
    
    try {
      // Используем правильный API для точечного обновления
      await app.fileManager.processFrontMatter(file, (frontmatter) => {
        if (newValue === null || newValue === undefined) {
          delete frontmatter[key];
        } else {
          frontmatter[key] = newValue;
        }
      });
    } catch (error) {
      console.error(`Failed to update frontmatter field "${key}":`, error);
    }
  }, [file, app, key]);
  
  // Синхронизируем состояние при внешних изменениях фронтматтера
  React.useEffect(() => {
    const currentValue = ctx.markdownPostProcessorContext.frontmatter?.[key];
    if (currentValue !== state && currentValue !== undefined) {
      setState(currentValue);
    }
  }, [ctx.markdownPostProcessorContext.frontmatter, key, state]);
  
  // Обёртка для setState, которая обновляет и локальное состояние, и frontmatter
  const setFrontmatterState = React.useCallback((newValue) => {
    const valueToSet = typeof newValue === 'function' ? newValue(state) : newValue;
    setState(valueToSet);
    updateFrontmatter(valueToSet);
  }, [state, updateFrontmatter]);
  
  return [state, setFrontmatterState];
};

// Экспортируем хук для использования в других компонентах
return useFrontmatterState;
```

