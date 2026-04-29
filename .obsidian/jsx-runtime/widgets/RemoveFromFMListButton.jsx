function RemoveFromFMListButton(props) {
  const fmKey = props.listFMKey ?? props.keyName ?? "";
  const title = props.title ?? "Удалить";
  const emptyMessage = props.emptyMessage ?? "Список пуст";
  const [items, setItems] = useFrontmatterState(fmKey, []);
  const bottomSheet = useBottomSheet();
  const alert = useAlertModal();

  const normalizedItems = Array.isArray(items) ? items : [];

  const removeValue = async () => {
    if (!fmKey) {
      await alert("Не передан ключ frontmatter списка (listFMKey).");
      return;
    }

    if (!normalizedItems.length) {
      await alert(emptyMessage);
      return;
    }

    const selected = await bottomSheet({
      title: `Удалить из "${fmKey}"`,
      message: "Выбери элемент для удаления",
      actions: normalizedItems.map((item, index) => ({
        id: String(index),
        label: String(item),
      })),
      cancelText: "Отмена",
    });

    if (selected === null) {
      return;
    }

    const selectedIndex = Number(selected);
    if (Number.isNaN(selectedIndex)) {
      return;
    }

    await setItems((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev.filter((_, index) => index !== selectedIndex);
    });
  };

  return (
    <button style={{...props.style}} className="mod-cta" onClick={removeValue} disabled={!fmKey}>
      {title}
    </button>
  );
}

module.exports = RemoveFromFMListButton;
