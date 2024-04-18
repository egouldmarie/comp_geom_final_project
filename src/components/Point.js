import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"

class PointClass extends React.Component {
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
                this.props.color &&
                (this.props.color.r !== prevProps.color.r ||
                    this.props.color.g !== prevProps.color.g ||
                    this.props.color.b !== prevProps.color.b)
            ) {
                for (let i = 0; i < this.point.children.length; i++) {
                    this.point.children[i].material.color = new THREE.Color(
                        "rgb(" +
                            this.props.color.r +
                            ", " +
                            this.props.color.g +
                            ", " +
                            this.props.color.b +
                            ")"
                    )
                    this.point.children[i].material.needsUpdate = true
                }
            }

            if (
                this.props.phi !== prevProps.phi ||
                this.props.theta !== prevProps.theta
            ) {
                this.point.rotation.setFromRotationMatrix(
                    new THREE.Matrix4().multiplyMatrices(
                        new THREE.Matrix4().makeRotationZ(this.props.theta),
                        new THREE.Matrix4().makeRotationY(this.props.phi)
                    )
                )
            }
        }
    }

    componentWillUnmount() {
        this.remove()
    }

    add() {
        if (!this.point && this.props.color) {
            let point = new THREE.Mesh(
                new THREE.SphereGeometry(0.025, 16, 16),
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
            point.position.set(1, 0, 0)
            let line = new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                    new THREE.Vector3(0, 0, 0),
                    new THREE.Vector3(1, 0, 0),
                ]),
                new THREE.LineDashedMaterial({
                    color: new THREE.Color(
                        "rgb(" +
                            this.props.color.r +
                            ", " +
                            this.props.color.g +
                            ", " +
                            this.props.color.b +
                            ")"
                    ),
                    dashSize: 0.05,
                    gapSize: 0.04,
                })
            )
            line.computeLineDistances()

            this.point = new THREE.Group()
            this.point.add(point)
            this.point.add(line)

            this.point.rotation.setFromRotationMatrix(
                new THREE.Matrix4().multiplyMatrices(
                    new THREE.Matrix4().makeRotationZ(this.props.theta),
                    new THREE.Matrix4().makeRotationY(this.props.phi)
                )
            )
        }

        if (
            this.point &&
            !this.state.added &&
            this.props.scene &&
            !this.props.scene.children.includes(this.point)
        ) {
            this.props.scene.add(this.point)
            this.setState({ added: true })
        }
    }

    remove() {
        if (this.point && this.props.scene) {
            this.props.scene.remove(this.point)
            this.setState({ added: false })
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
    return {}
}

const Point = connect(mapStateToProps, mapDispatchToProps)(PointClass)

export { Point }
