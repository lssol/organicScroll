const down = () => {
    window.scrollBy(0, 5)
}
const up = () => {
    window.scrollBy(0, -5)
}

const action = {
    'KeyJ': down,
    'KeyK': up,
}

window.onload = () => {
    document.addEventListener("keydown", e => {
        if (action.hasOwnProperty(e.code))
            action[e.code]()
    })
}