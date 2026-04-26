---
defines-react-components: true
react-components-namespace:
---

```jsx:component:AttributeWithBar

const title = props.title ?? "неизвестный атрибут"

const maxAmount = props.max ?? 100
const minAmount = props.min ?? 0

const [val, setVal] = useState(100)
// const [val, setVal] = useFrontmatterState("hp", 100)
//const tst = useFrontmatterState("hp", 100)

const labelStyle = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -65%)",
	userSelect: "none",
}

const onApply = (valueToApply) => {
	const sum = val + valueToApply
	
	const normalized = Math.max(Math.min(sum, maxAmount), minAmount)
	
	setVal(normalized)
}

return (
	<div>
		<h1>{title}</h1>
		<div style={{position: "relative"}}>
			<label 
				htmlFor={`propgress ${title}`}
				style={labelStyle}>
				{val}/{maxAmount}
			</label>
			<progress max={maxAmount} value={val} style={{
			height: "32px",
			width: "100%"
			}}/>
		</div>
		<AttributeAplier onSubmit={onApply}/>
	</div>
)
```