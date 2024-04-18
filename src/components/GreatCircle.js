import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"

const vertexShader = `
    precision highp float;

    varying vec3 vPosition;

    void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`
const fragmentShader = `
    precision highp float;

    uniform vec3 point1;
    uniform vec3 point2;

    uniform vec3 color1;
    uniform vec3 color2;

    varying vec3 vPosition;

    float PI = 3.141593;

    void main() {
        float angle = acos(dot(point1, point2));
        float angle1 = acos(dot(vPosition, point1));
        float angle2 = acos(dot(vPosition, point2));
        if(angle1 < angle && angle2 < angle && acos(dot(vPosition, normalize(point1+point2)))<PI/2.) {
            float r = (angle2/angle)*color1.r + (angle1/angle)*color2.r;
            float g = (angle2/angle)*color1.g + (angle1/angle)*color2.g;
            float b = (angle2/angle)*color1.b + (angle1/angle)*color2.b;
            gl_FragColor = vec4(r, g, b, 1.);
        }
    }
`

class GreatCircleClass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            added: false,
        }
    }

    componentDidMount() {
        this.add()
    }

    componentDidUpdate(prevProps) {
        this.add()
        if (this.circle) {
            if (
                (this.props.color1 &&
                    (this.props.color1.r !== prevProps.color1.r ||
                        this.props.color1.g !== prevProps.color1.g ||
                        this.props.color1.b !== prevProps.color1.b)) ||
                (this.props.color2 &&
                    (this.props.color2.r !== prevProps.color2.r ||
                        this.props.color2.g !== prevProps.color2.g ||
                        this.props.color2.b !== prevProps.color2.b))
            ) {
                this.circle.material.uniforms["color1"] = {
                    value: new THREE.Color(
                        new THREE.Color(
                            "rgb(" +
                                this.props.color1.r +
                                "," +
                                this.props.color1.g +
                                "," +
                                this.props.color1.b +
                                ")"
                        )
                    ),
                }
                this.circle.material.uniforms["color2"] = {
                    value: new THREE.Color(
                        new THREE.Color(
                            "rgb(" +
                                this.props.color2.r +
                                "," +
                                this.props.color2.g +
                                "," +
                                this.props.color2.b +
                                ")"
                        )
                    ),
                }
                this.circle.material.needsUpdate = true
            }
            if (
                (this.props.euler1 &&
                    (this.props.euler1.x !== prevProps.euler1.x ||
                        this.props.euler1.y !== prevProps.euler1.y ||
                        this.props.euler1.z !== prevProps.euler1.z)) ||
                (this.props.euler2 &&
                    (this.props.euler2.x !== prevProps.euler2.x ||
                        this.props.euler2.y !== prevProps.euler2.y ||
                        this.props.euler2.z !== prevProps.euler2.z))
            ) {
                // compute rotation from euler1 and euler2
                let { euler, point1, point2 } = this.getRotationAndPoints()
                this.circle.material.uniforms["point1"] = { value: point1 }
                this.circle.material.uniforms["point2"] = { value: point2 }
                this.circle.material.uniforms.needsUpdate = true
                this.circle.material.needsUpdate = true
                this.circle.rotation.set(euler.x, euler.y, euler.z)
            }
        }
    }

    componentWillUnmount() {
        this.remove()
    }

    add() {
        if (
            !this.circle &&
            this.props.color1 &&
            this.props.color2 &&
            this.props.euler1 &&
            this.props.euler2
        ) {
            let geometry = new THREE.BufferGeometry()
            let count = 64
            let vertices = new Float32Array((count + 1) * 3)

            for (let i = 0; i < count; i++) {
                vertices[3 * i] = Math.cos(i * ((2 * Math.PI) / count))
                vertices[3 * i + 1] = Math.sin(i * ((2 * Math.PI) / count))
                vertices[3 * i + 2] = 0
            }
            vertices[3 * count] = vertices[0]
            vertices[3 * count + 1] = vertices[1]
            vertices[3 * count + 2] = vertices[2]
            geometry.setAttribute(
                "position",
                new THREE.BufferAttribute(vertices, 3)
            )

            let { euler, point1, point2 } = this.getRotationAndPoints()

            this.circle = new THREE.Line(
                geometry,
                new THREE.ShaderMaterial({
                    uniforms: {
                        color1: {
                            value: new THREE.Color(
                                new THREE.Color(
                                    "rgb(" +
                                        this.props.color1.r +
                                        "," +
                                        this.props.color1.g +
                                        "," +
                                        this.props.color1.b +
                                        ")"
                                )
                            ),
                        },
                        color2: {
                            value: new THREE.Color(
                                new THREE.Color(
                                    "rgb(" +
                                        this.props.color2.r +
                                        "," +
                                        this.props.color2.g +
                                        "," +
                                        this.props.color2.b +
                                        ")"
                                )
                            ),
                        },
                        point1: { value: point1 },
                        point2: { value: point2 },
                    },
                    transparent: true,
                    vertexShader,
                    fragmentShader,
                })
            )

            this.circle.rotation.set(euler.x, euler.y, euler.z)
        }

        if (
            this.circle &&
            !this.state.added &&
            this.props.scene &&
            !this.props.scene.children.includes(this.circle)
        ) {
            this.props.scene.add(this.circle)
            this.setState({ added: true })
        }
    }

    remove() {
        if (this.circle && this.props.scene) {
            this.props.scene.remove(this.circle)
            this.setState({ added: false })
        }
    }

    getRotationAndPoints() {
        // compute rotation from euler1 and euler2
        let pnt1 = new THREE.Vector3(1, 0, 0).applyEuler(
            new THREE.Euler(
                this.props.euler1.x,
                this.props.euler1.y,
                this.props.euler1.z
            )
        )
        let pnt2 = new THREE.Vector3(1, 0, 0).applyEuler(
            new THREE.Euler(
                this.props.euler2.x,
                this.props.euler2.y,
                this.props.euler2.z
            )
        )
        let cross = new THREE.Vector3().crossVectors(pnt1, pnt2).normalize()
        let euler = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(
                new THREE.Vector3(0, 0, 1),
                cross
            )
        )
        let eulerInv = new THREE.Euler().setFromQuaternion(
            new THREE.Quaternion().setFromEuler(euler).invert()
        )

        let point1 = pnt1.applyEuler(eulerInv)
        let point2 = pnt2.applyEuler(eulerInv)

        //let angle1 = Math.acos(vec1.dot(new THREE.Vector3(1, 0, 0)))
        //let angle2 = Math.acos(vec2.dot(new THREE.Vector3(1, 0, 0)))

        return { euler, point1, point2 }
    }

    render() {
        return null
    }
}

function mapStateToProps(state, ownProps) {
    return {
        color1: state.points?.[ownProps.id1]?.color,
        color2: state.points?.[ownProps.id2]?.color,
        euler1: state.points?.[ownProps.id1]?.euler,
        euler2: state.points?.[ownProps.id2]?.euler,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {}
}

const GreatCircle = connect(
    mapStateToProps,
    mapDispatchToProps
)(GreatCircleClass)

export { GreatCircle }
