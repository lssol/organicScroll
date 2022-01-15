let f = 0.30
const k = 0.065
const m = 10

// f : millisecond -> velocity
const applyMovementFunction = (v) => {
    const step = 5
    let t = step
    let dy = 0
    const run = () => {
        dy = v(t) * step
        let dy_rd = Math.round(dy)
        if (dy === 0 && t != 0)
            return
        window.scrollBy(0, dy_rd)
        t += step
    }

    let interval = window.setInterval(run, step)

    return {
        cancel: () => {
            window.clearInterval(interval)
            return dy/step
        }
    }
}

const applyForce = (v0, dir, multiplier) => {
    let f1 = dir * (f * multiplier)
    console.log("Applying force ", f1)
    return t => (v0 - (f1/k)) * (Math.exp(-(k/m) * t)) + f1/k
}

const stopForce = (v0) => {
    return t => v0 * Math.exp(-t * (k/m))
}

const Mover = () => {
    let currentMovement = null
    let v0 = 0
    const move = (dir, multiplier) => {
        if (currentMovement) {
            v0 = currentMovement.cancel()
            currentMovement = null
        }
        let v = applyForce(v0, dir, multiplier)
        currentMovement = applyMovementFunction(v)
        lastDir = dir
    }
    const release = () => {
        if (!currentMovement)
            return
        v0 = currentMovement.cancel()
        currentMovement = null
        let v = stopForce(v0)
        currentMovement = applyMovementFunction(v)
    }
    return {
        move: move,
        release: release
    }
}

const dir = { down: 1, up: -1 }
const speed = { normal: 1, double: 4 }
const modifiers = { alt: "Alt", control: "Control", shift: "Shift"}

const mover = Mover()

const actions = {
    'Shift+KeyJ': () => mover.move(dir.down, speed.double),
    'Shift+KeyK': () => mover.move(dir.up, speed.double),
    'KeyJ': () => mover.move(dir.down, speed.normal),
    'KeyK': () => mover.move(dir.up, speed.normal),

    'Shift+ArrowDown': () => mover.move(dir.down, speed.double),
    'Shift+ArrowUp': () => mover.move(dir.up, speed.double),
    'ArrowDown': () => mover.move(dir.down, speed.normal),
    'ArrowUp': () => mover.move(dir.up, speed.normal),
}

const release = mover.release
const getModifier = e => {
    if (e.ctrlKey) return 'Ctrl'
    if (e.shiftKey) return 'Shift'
    if (e.altKey) return 'Alt'
    else return false
}
window.onload = () => {
    document.addEventListener("keydown", e => {
        const mod = getModifier(e)
        const key = (mod ? mod + '+' : '') + e.code
        if (actions.hasOwnProperty(key)) {
            console.log('Pressed on ', key)
            actions[key]()
        }
    })
    document.addEventListener('keyup', e => {
        if (actions.hasOwnProperty(e.code))
            release()
    })
}