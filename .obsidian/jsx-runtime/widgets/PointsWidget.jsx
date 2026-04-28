import ProgressView from "../ui-kit/ProgressView.jsx";
import AttributeApplier from "../ui-kit/AttributeApplier.jsx";
import format from "../lib/stringFormat.js";

function PointsWidget(props) {
  const title = props.title ?? "Health";
  const [attribute] = useFrontmatterState(props.attributeKey ?? "сила", 10);
  const [storedValue, setValue] = useFrontmatterState(
    props.currentPointKey ?? "хп_текущее",
    10
  );

  const maxValue = React.useMemo(() => {
    const calculation = props.calculation ?? "20 + ${attribute} * 2";
    return eval(format(calculation, { attribute }));
  }, [attribute, props.calculation]);

  const onApply = (valueToApply) => {
    const normalized = Math.max(Math.min(storedValue + valueToApply, maxValue), 0);
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

module.exports = PointsWidget;
