function AttributeApplier(props) {
  const [inputState, setInput] = React.useState("");
  const onSubmit = props.onSubmit ?? (() => {});
  const inputReg = /^[+-]?\s?\d+$/;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputReg.test(inputState)) return;

    const multiplier = inputState.includes("-") ? -1 : 1;
    const match = inputState.match(/\d+/);
    if (!match) return;

    const number = Number(match[0]);
    onSubmit(number * multiplier);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ width: "100%", display: "flex", gap: "16px" }}
    >
      <input
        type="text"
        value={inputState}
        placeholder="+/- 123"
        onChange={(e) => setInput(e.target.value)}
        style={{ flexGrow: "1" }}
      />
      <button type="submit" disabled={!inputReg.test(inputState)}>
        Apply
      </button>
    </form>
  );
}

module.exports = AttributeApplier;
