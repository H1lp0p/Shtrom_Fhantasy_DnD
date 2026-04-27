import useFMState from "../hooks/useFMState"
import { useMemo } from "react"

const defaultProps = {
    FMKey: "key",
    calc: "${value} + 10"
}

export default function CalculatedString(props) {
    
    const spanStyle = {
        padding: "4px",
        backgroundColor: "var(--code-background, #2a2a2a)",
        borderRadius: "4px"
    }

    const [value] = useFMState(props.FMKey, 0)
    
    const calculated = useMemo(() => {
            const calculation = props.calculation ?? "${value}"
            const formatted = format(calculation, {value: value})
            const result = eval(formatted)
        
            return result
        }, [value, props.calculation]
    )

    return (
        <span style={spanStyle}>{calculated}</span>
    )
}