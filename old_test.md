---
hp: 0
mp: 34
str: 6
int: 12
sp: 2
снаряжение:
  - Арбалет
  - Боевой молот
  - Цестус
---

```react
<PointsWidget
	title={"❤️ Текущее HP"}
	currentPointKey={"hp"}
	attributeKey={"str"}
	calculation={"20 + ${attribute} * 2"}
/>
```
---
```react
<PointsWidget
	title={"💙 Текущее MP"}
	currentPointKey={"mp"}
	attributeKey={"int"}
	calculation={"10 + ${attribute} * 2"}
/>
```

Очки способностей: 
```react
<CalculatedString FMKey={"sp"}/>
```

```dataview
TABLE WITHOUT ID
  file.link as Оружие,
  урон as Урон,
  свойства as Свойства
FROM "Снаряжение"
WHERE тип = "Оружие" AND contains(this.снаряжение, file.name)
```

```react
<>
	<AddFileToFMForm directory={"Снаряжение"} listFMKey={"снаряжение"}/>
	<RemoveFromFMListButton
		listFMKey="снаряжение"
		title="Удалить из снаряжения"
		emptyMessage="В снаряжении пока нет элементов"
	/>
</>
```