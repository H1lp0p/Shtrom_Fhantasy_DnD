export default getModifierCalculationString = (stat) => {
    const result = Math.floor((stat - 10) / 2)

    return `${result > 0 ? "+" : ""}${result}`
}