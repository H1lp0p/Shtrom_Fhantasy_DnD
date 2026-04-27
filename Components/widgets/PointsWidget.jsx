import { AttributeWithBar, useFMState, ProgressView, format } from "../index.js"
import { useMemo } from "react"

const defaultProps = {
    currentPointKey : "хп_текущее",
    attributeKey: "сила",
    calculation: '20 + ${attribute} * 2 + 10 - 10',
    title: "Здоровье"
}

export default function PointsWidget(props) {
    const title = props.title ?? "Неизвестный атрибут"
    const [attribute] = useFMState(props.attributeKey, 10)
    const [storedValue, setValue] = useFMState(props.currentPointKey, 10)

    const minValue = 0

    const maxValue = useMemo(() => {
            const calculation = props.calculation ?? defaultProps.calculation
            const formatted = format(calculation, {attribute: attribute})
            const result = eval(formatted)
        
            return result
        }, [attribute, props.calculation]
    )

    const onApply = (valueToApply) => {
        const sum = storedValue + valueToApply
        
        const normalized = Math.max(Math.min(sum, maxValue), minValue)
        
        setValue(normalized)
    }

    const containerStyle = {}

    if (attribute === undefined || attribute === null) {
        return null
    }

    return (
        <div style={containerStyle}>
                    <h1>{title}</h1>
                    <div style={{position: "relative"}}>
                        <ProgressView
                            id={`progress_${title}`}
                            current={storedValue}
                            max={maxValue}
                        />
                    </div>
                    <AttributeApplier onSubmit={onApply}/>
                </div>
    )
}