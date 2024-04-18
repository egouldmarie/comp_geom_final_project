import * as THREE from "three"

export function makeID(length) {
    let result = ""
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    const charactersLength = characters.length
    let counter = 0
    while (counter < length) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
        counter += 1
    }
    return result
}

export class PlaneHelper extends THREE.Mesh {
    constructor(plane, size = 1, hex = 0xffffff) {
        const color = hex

        const positions = [
            1, 1, 0, -1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, 1, -1, 0,
        ]

        const geometry = new THREE.BufferGeometry()
        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(positions, 3)
        )
        geometry.computeBoundingSphere()

        super(
            geometry,
            new THREE.MeshBasicMaterial({
                side: THREE.DoubleSide,
                color: color,
                opacity: 0.5,
                transparent: true,
            })
        )

        this.type = "PlaneHelper"

        this.plane = plane

        this.size = size
    }

    updateMatrixWorld(force) {
        this.position.set(0, 0, 0)
        this.scale.set(0.5 * this.size, 0.5 * this.size, 1)
        this.lookAt(this.plane.normal)
        this.translateZ(-this.plane.constant)
        super.updateMatrixWorld(force)
    }

    dispose() {
        this.geometry.dispose()
        this.material.dispose()
    }
}
