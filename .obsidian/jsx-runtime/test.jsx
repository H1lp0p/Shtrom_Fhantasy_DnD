const TestCard = (props) => {
    return <div>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
    </div>
}

module.exports = { TestCard };