import { useState } from "react"

import { useFMState } from "../index.js"
import { AttributeApplier } from "../index.js"

const defaultProps = {
    title: "Неизвестный атрибут",
    maxAmountFMKey: "max_amount",
    minAmountFMKey: "min_amount",
    storedAmountFMKey: "stored_amount"
}

export default function AttributeWithBar(props) {
    const title = props.title ?? "Неизвестный атрибут"

    const [minValue] = useFMState(props.minAmountFMKey, 0)

    const [maxValue] = useFMState(props.maxAmountFMKey, 100)

    const [storedValue, setValue] = useFMState(props.storedAmountFMKey, 100)

    const labelStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -65%)",
        userSelect: "none",
    }

    const containerStyle = {
    }

    const onApply = (valueToApply) => {
        const sum = storedValue + valueToApply
        
        const normalized = Math.max(Math.min(sum, maxValue), minValue)
        
        setValue(normalized)
    }

    return (
        <div style={containerStyle}>
            <h1>{title}</h1>
            <div style={{position: "relative"}}>
                <label 
                    htmlFor={`propgress ${title}`}
                    style={labelStyle}>
                    {storedValue}/{maxValue}
                </label>
                <progress max={maxValue} value={storedValue} style={{
                height: "32px",
                width: "100%"
                }}/>
            </div>
            <AttributeApplier onSubmit={onApply}/>
        </div>
    )
}