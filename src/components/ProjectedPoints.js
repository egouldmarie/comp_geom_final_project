import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"

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

            this.point.frustumCulled = false
            window.point = this.point

            this.point.onBeforeRender = () => {
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
        }
    }

    remove() {
        if (this.point && this.props.group) {
            this.props.group.remove(this.point)
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

const ProjectedPoint = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectedPointClass)

export { ProjectedPoint }
