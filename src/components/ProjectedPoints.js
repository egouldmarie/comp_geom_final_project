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
                this.props.euler?.x !== prevProps.euler?.x ||
                this.props.euler?.y !== prevProps.euler?.y ||
                this.props.euler?.z !== prevProps.euler?.z ||
                this.props.normalx !== this.state.normalx ||
                this.props.normaly !== this.state.normaly ||
                this.props.normalz !== this.state.normalz
            ) {
                let pos = new THREE.Vector3()
                this.props.plane?.intersectLine(
                    new THREE.Line3(
                        new THREE.Vector3(),
                        new THREE.Vector3(1, 0, 0)
                            .applyEuler(
                                new THREE.Euler(
                                    this.props.euler?.x,
                                    this.props.euler?.y,
                                    this.props.euler?.z
                                )
                            )
                            .multiplyScalar(100)
                    ),
                    pos
                )

                if (pos.x === 0 && pos.y === 0 && pos.z === 0) {
                    this.point.visible = false
                } else {
                    this.point.visible = true
                    this.point.position.set(pos.x, pos.y, pos.z)
                }
                this.setState({
                    normalx: this.props.normalx,
                    normaly: this.props.normaly,
                    normalz: this.props.normalz,
                })
            }
        }
    }

    componentWillUnmount() {
        this.remove()
    }

    add() {
        if (!this.point && this.props.color && this.props.euler) {
            this.point = new THREE.Mesh(
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

            let pos = new THREE.Vector3()
            this.props.plane?.intersectLine(
                new THREE.Line3(
                    new THREE.Vector3(),
                    new THREE.Vector3(1, 0, 0)
                        .applyEuler(
                            new THREE.Euler(
                                this.props.euler?.x,
                                this.props.euler?.y,
                                this.props.euler?.z
                            )
                        )
                        .multiplyScalar(100)
                ),
                pos
            )

            this.point.position.set(pos.x, pos.y, pos.z)
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
        plane: state.plane,
        color: state.points?.[ownProps.id]?.color,
        euler: state.points?.[ownProps.id]?.euler,
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
