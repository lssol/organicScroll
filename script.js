let f = 0.25
if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
    f = 0.8
}
const k = 0.08
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

const applyForce = (v0, dir) => {
    let f1 = dir * f
    return t => (v0 - (f1/k)) * (Math.exp(-(k/m) * t)) + f1/k
}
const stopForce = (v0) => {
    return t => v0 * Math.exp(-t * (k/m))
}

const Mover = () => {
    let currentMovement = null
    let v0 = 0
    let lastDir = 0
    const move = dir => {
        if (currentMovement) {
            v0 = currentMovement.cancel()
            currentMovement = null
            // if (lastDir != dir) {
            //     lastDir = dir
            //     return
            // }
        }
        let v = applyForce(v0, dir)
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

const mover = Mover()
const up = () => mover.move(-1)
const down = () => mover.move(1)
const release = mover.release
const press = {
    'KeyJ': down,
    'KeyK': up,
}

window.onload = () => {
    document.addEventListener("keydown", e => {
        if (press.hasOwnProperty(e.code))
            press[e.code]()
    })
    document.addEventListener('keyup', e => {
        if (press.hasOwnProperty(e.code))
            release()
    })
}