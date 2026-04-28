import format from "../lib/stringFormat.js";

function CalculatedString(props) {
  const [value] = useFrontmatterState(props.FMKey ?? "key", 0);
  const calculated = React.useMemo(() => {
    const calculation = props.calculation ?? "${value}";
    const formatted = format(calculation, { value });
    return eval(formatted);
  }, [value, props.calculation]);

  return (
    <span
      style={{
        padding: "4px",
        backgroundColor: "var(--code-background, #2a2a2a)",
        borderRadius: "4px",
      }}
    >
      {calculated}
    </span>
  );
}

module.exports = CalculatedString;
