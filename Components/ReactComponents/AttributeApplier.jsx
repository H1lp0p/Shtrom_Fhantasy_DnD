import { useState } from "react"

export default function AttributeApplier(props) {
    const [inputState, setInput] = useState("")

const onSubmit = props.onSubmit ?? ((value) => {})

const handleSubmit = () => {
	
	const multiplier = inputState.includes("-") ? -1 : 1
	
	const number = Number(inputState.match(/\d+/))
	
	const resultValue = number * multiplier
	
	setInput("")
	
	onSubmit(resultValue)
}

const input_reg = /^[+-]?\s?\d+$/

return (
	<div 
		style={{
		width: "100%",
		display: "flex",
		gap: "16px"
		}}>
			<input
				type={"text"}
				value={inputState}
				placeholder={"+/- 123"}
				onChange={ (e) => {setInput((e.target.value))}}
				style={{
				flexGrow: "1"
				}}/>
			<button
				onClick={() => {handleSubmit()}}
				disabled={!input_reg.test(inputState)}>
				Apply
			</button>
	</div>
	)
}