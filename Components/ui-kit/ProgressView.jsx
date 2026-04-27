export default function ProgressView(props) {

    const labelStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -65%)",
        userSelect: "none",
    }

    const progressStyle = {
        height: "32px",
        width: "100%"
    }

    return (
        <div style={{position: "relative"}}>
                <label 
                    htmlFor={`propgress ${props.id}`}
                    style={labelStyle}>
                    {props.current}/{props.max}
                </label>
                <progress max={props.max} value={props.current} style={progressStyle}/>
        </div>
    )
}