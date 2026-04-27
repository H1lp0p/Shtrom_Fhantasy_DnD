import { useState } from "react"

import { ProgressView, useFMState } from "../index.js"
import { AttributeApplier } from "../index.js"

const defaultProps = {
    title: "Неизвестный атрибут",
    maxAmountFMKey: "max_amount",
    minAmountFMKey: "min_amount",
    storedAmountFMKey: "stored_amount",
    minValue: 0,
    maxValue: 100,
}

export default function AttributeWithBar(props) {
    const title = props.title ?? "Неизвестный атрибут"

    const [minValue] = useFMState(props.minAmountFMKey, props.minValue ?? 0)

    const [maxValue] = useFMState(props.maxAmountFMKey, props.maxValue ?? 100)

    const [storedValue, setValue] = useFMState(props.storedAmountFMKey, 100)

    const containerStyle = {}

    const onApply = (valueToApply) => {
        const sum = storedValue + valueToApply
        
        const normalized = Math.max(Math.min(sum, maxValue), minValue)
        
        setValue(normalized)
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