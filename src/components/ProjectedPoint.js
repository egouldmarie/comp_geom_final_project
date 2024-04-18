import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"
import { setProjectedPoint } from "../store.js"

class ProjectedPointClass extends React.Component {
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
        if (this.point) {
            if (
                this.props.color.r !== prevProps.color.r ||
                this.props.color.g !== prevProps.color.g ||
                this.props.color.b !== prevProps.color.b
            ) {
                this.point.material.color = new THREE.Color(
                    "rgb(" +
                        this.props.color.r +
                        ", " +
                        this.props.color.g +
                        ", " +
                        this.props.color.b +
                        ")"
                )
                this.point.material.needsUpdate = true
            }
        }
    }

    componentWillUnmount() {
        this.remove()
    }

    add() {
        if (!this.point && this.props.color) {
            this.point = new THREE.Mesh(
                new THREE.SphereGeometry(0.04, 16, 16),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(
                        "rgb(" +
                            this.props.color.r +
                            ", " +
                            this.props.color.g +
                            ", " +
                            this.props.color.b +
                            ")"
                    ),
                })
            )
            this.point.myID = this.props.id
            this.point.frustumCulled = false

            this.point.onBeforeRender = () => {
                if (
                    this._phi === undefined ||
                    this._theta === undefined ||
                    this._normalX === undefined ||
                    this._normalY === undefined ||
                    this._normalZ === undefined ||
                    Math.abs(this.props.phi - this._phi) > 0.000001 ||
                    Math.abs(this.props.theta - this._theta) > 0.000001 ||
                    Math.abs(this.props.plane.normal.x - this._normalX) >
                        0.000001 ||
                    Math.abs(this.props.plane.normal.y - this._normalY) >
                        0.000001 ||
                    Math.abs(this.props.plane.normal.z - this._normalZ) >
                        0.000001
                ) {
                    let pos = new THREE.Vector3()
                    this.props.plane?.intersectLine(
                        new THREE.Line3(
                            new THREE.Vector3(),
                            new THREE.Vector3(1, 0, 0)
                                .applyMatrix4(
                                    new THREE.Matrix4().multiplyMatrices(
                                        new THREE.Matrix4().makeRotationZ(
                                            this.props.theta
                                        ),
                                        new THREE.Matrix4().makeRotationY(
                                            this.props.phi
                                        )
                                    )
                                )
                                .multiplyScalar(100)
                        ),
                        pos
                    )

                    this.point.position.set(pos.x, pos.y, pos.z)

                    if (pos.x === 0 && pos.y === 0 && pos.z === 0) {
                        this.point.position.set(1000000, 1000000, 1000000)
                    } else {
                        this.point.position.set(pos.x, pos.y, pos.z)
                    }

                    this._normalX = this.props.plane.normal.x
                    this._normalY = this.props.plane.normal.y
                    this._normalZ = this.props.plane.normal.z
                    this._theta = this.props.theta
                    this._phi = this.props.phi
                }
            }
        }

        if (
            this.point &&
            !this.state.added &&
            this.props.group &&
            !this.props.group.children.includes(this.point)
        ) {
            this.props.group.add(this.point)
            this.setState({ added: true })

            this.props.setProjectedPoint(true)
        }
    }

    remove() {
        if (this.point && this.props.group) {
            this.props.group.remove(this.point)
            this.setState({ added: false })

            this.props.setProjectedPoint(false)
        }
    }

    render() {
        return null
    }
}

function mapStateToProps(state, ownProps) {
    return {
        phi: state.points?.[ownProps.id]?.phi,
        theta: state.points?.[ownProps.id]?.theta,
        color: state.points?.[ownProps.id]?.color,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setProjectedPoint: (point) =>
            dispatch(setProjectedPoint(ownProps.id, point)),
    }
}

const ProjectedPoint = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectedPointClass)

export { ProjectedPoint }
