import ProgressView from "../ui-kit/ProgressView.jsx";
import AttributeApplier from "../ui-kit/AttributeApplier.jsx";

function AttributeWithBar(props) {
  const title = props.title ?? "Unknown attribute";
  const [minValue] = useFrontmatterState(
    props.minAmountFMKey ?? "min_amount",
    props.minValue ?? 0
  );
  const [maxValue] = useFrontmatterState(
    props.maxAmountFMKey ?? "max_amount",
    props.maxValue ?? 100
  );
  const [storedValue, setValue] = useFrontmatterState(
    props.storedAmountFMKey ?? "stored_amount",
    100
  );

  const onApply = (valueToApply) => {
    const sum = storedValue + valueToApply;
    const normalized = Math.max(Math.min(sum, maxValue), minValue);
    setValue(normalized);
  };

  return (
    <div>
      <h3>{title}</h3>
      <ProgressView id={`progress_${title}`} current={storedValue} max={maxValue} />
      <AttributeApplier onSubmit={onApply} />
    </div>
  );
}

module.exports = AttributeWithBar;
