function ProgressView(props) {
  return (
    <div style={{ position: "relative" }}>
      <label
        htmlFor={`progress-${props.id ?? "value"}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -65%)",
          userSelect: "none",
        }}
      >
        {props.current}/{props.max}
      </label>
      <progress
        id={`progress-${props.id ?? "value"}`}
        max={props.max}
        value={props.current}
        style={{ height: "32px", width: "100%" }}
      />
    </div>
  );
}

module.exports = ProgressView;
