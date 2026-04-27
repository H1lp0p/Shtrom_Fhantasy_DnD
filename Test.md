---
hp: 32
mp: 34
str: 6
int: 12
sp: 2
---

```emera
<PointsWidget
	title={"❤️ Текущее HP"}
	currentPointKey={"hp"}
	attributeKey={"str"}
	calculation={"20 + ${attribute} * 2"}
/>
```
---
```emera
<PointsWidget
	title={"💙 Текущее MP"}
	currentPointKey={"mp"}
	attributeKey={"int"}
	calculation={"10 + ${attribute} * 2"}
/>
```

Очки способностей: `emera:<CalculatedString FMKey={"sp"}/>`
