import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"

class ProjectedLineClass extends React.Component {
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
        if (this.line) {
            if (
                this.props.color1.r !== prevProps.color1.r ||
                this.props.color1.g !== prevProps.color1.g ||
                this.props.color1.b !== prevProps.color1.b ||
                this.props.color2.r !== prevProps.color2.r ||
                this.props.color2.g !== prevProps.color2.g ||
                this.props.color2.b !== prevProps.color2.b
            ) {
                this.line.geometry.attributes.color.setXYZ(
                    0,
                    this.props.color1.r / 255,
                    this.props.color1.g / 255,
                    this.props.color1.b / 255
                )
                this.line.geometry.attributes.color.setXYZ(
                    1,
                    this.props.color2.r / 255,
                    this.props.color2.g / 255,
                    this.props.color2.b / 255
                )
                this.line.geometry.attributes.color.needsUpdate = true
            }
        }
    }

    componentWillUnmount() {
        this.remove()
    }

    add() {
        if (!this.line && this.props.point1 && this.props.point2) {
            let geometry = new THREE.BufferGeometry()
            geometry.setFromPoints([
                this.props.point1.position,
                this.props.point2.position,
            ])
            geometry.setAttribute(
                "color",
                new THREE.Float32BufferAttribute(
                    [
                        this.props.color1.r / 255,
                        this.props.color1.g / 255,
                        this.props.color1.b / 255,
                        this.props.color2.r / 255,
                        this.props.color2.g / 255,
                        this.props.color2.b / 255,
                    ],
                    3
                )
            )

            this.line = new THREE.Line(
                geometry,
                new THREE.LineBasicMaterial({
                    transparent: true,
                    vertexColors: true,
                })
            )
            this.line.frustumCulled = false
            this.line.depthTest = false
            this.line.depthWrite = false
            this.line.renderOrder = 10000
            this.line.onBeforeRender = (renderer) => {
                renderer.clearDepth()
                if (
                    this._phi1 === undefined ||
                    this._theta1 === undefined ||
                    this._phi2 === undefined ||
                    this._theta2 === undefined ||
                    this._normalX === undefined ||
                    this._normalY === undefined ||
                    this._normalZ === undefined ||
                    Math.abs(this.props.phi1 - this._phi1) > 0.000001 ||
                    Math.abs(this.props.theta1 - this._theta1) > 0.000001 ||
                    Math.abs(this.props.phi2 - this._phi2) > 0.000001 ||
                    Math.abs(this.props.theta2 - this._theta2) > 0.000001 ||
                    Math.abs(this.props.plane.normal.x - this._normalX) >
                        0.000001 ||
                    Math.abs(this.props.plane.normal.y - this._normalY) >
                        0.000001 ||
                    Math.abs(this.props.plane.normal.z - this._normalZ) >
                        0.000001
                ) {
                    this.line.geometry.attributes.position.setXYZ(
                        0,
                        this.props.point1.position.x,
                        this.props.point1.position.y,
                        this.props.point1.position.z
                    )
                    this.line.geometry.attributes.position.setXYZ(
                        1,
                        this.props.point2.position.x,
                        this.props.point2.position.y,
                        this.props.point2.position.z
                    )
                    this.line.geometry.attributes.position.needsUpdate = true

                    this._normalX = this.props.plane.normal.x
                    this._normalY = this.props.plane.normal.y
                    this._normalZ = this.props.plane.normal.z
                    this._theta1 = this.props.theta1
                    this._phi1 = this.props.phi1
                    this._theta2 = this.props.theta2
                    this._phi2 = this.props.phi2
                }
            }
        }

        if (
            this.line &&
            !this.state.added &&
            this.props.group &&
            !this.props.group.children.includes(this.line)
        ) {
            this.props.group.add(this.line)
            this.setState({ added: true })
        }
    }

    remove() {
        if (this.line && this.props.group) {
            this.props.group.remove(this.line)
            this.setState({ added: false })
        }
    }

    render() {
        return null
    }
}

function mapStateToProps(state, ownProps) {
    return {
        phi1: state.points?.[ownProps.id1]?.phi,
        theta1: state.points?.[ownProps.id1]?.theta,
        color1: state.points?.[ownProps.id1]?.color,
        phi2: state.points?.[ownProps.id2]?.phi,
        theta2: state.points?.[ownProps.id2]?.theta,
        color2: state.points?.[ownProps.id2]?.color,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {}
}

const ProjectedLine = connect(
    mapStateToProps,
    mapDispatchToProps
)(ProjectedLineClass)

export { ProjectedLine }
