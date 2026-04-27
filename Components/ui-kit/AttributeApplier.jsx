import { useState } from "react"

export default function AttributeApplier(props) {
    const [inputState, setInput] = useState("")

    const onSubmit = props.onSubmit ?? ((value) => {})

    const handleSubmit = (e) => {
        e.preventDefault()
        
        if (!input_reg.test(inputState)) return
        
        const multiplier = inputState.includes("-") ? -1 : 1
        const match = inputState.match(/\d+/)
        
        if (!match) return
        
        const number = Number(match[0])
        const resultValue = number * multiplier
        
        setInput("")
        onSubmit(resultValue)
    }

    const input_reg = /^[+-]?\s?\d+$/

    return (
        <form 
            onSubmit={handleSubmit}
            style={{
                width: "100%",
                display: "flex",
                gap: "16px"
            }}>
            <input
                type={"text"}
                value={inputState}
                placeholder={"+/- 123"}
                onChange={(e) => setInput(e.target.value)}
                style={{
                    flexGrow: "1"
                }}
            />
            <button
                type="submit"
                disabled={!input_reg.test(inputState)}>
                Apply
            </button>
        </form>
    )
}