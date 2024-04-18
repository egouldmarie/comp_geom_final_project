import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

import { PlaneHelper } from "../utils/utils.js"
import { ProjectedLine } from "./ProjectedLine.js"
import { ProjectedPoint } from "./ProjectedPoint.js"

class OrthoProjViewClass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        let orthoWidth = this.mount?.clientWidth || 100
        let orthoHeight = this.mount?.clientHeight || 100
        this.orthoRenderer = new THREE.WebGLRenderer()
        this.orthoRenderer.setSize(orthoWidth, orthoHeight)
        this.orthoRenderer.domElement.getContext("2d", {
            willReadFrequently: true,
        })

        let frustumSize = 2
        this.orthoCamera = new THREE.OrthographicCamera(
            frustumSize / -2,
            frustumSize / 2,
            frustumSize / 2,
            frustumSize / -2,
            0.1,
            10
        )
        this.orthoCamera.up.set(0, 0, 1)
        this.orthoCamera.position.set(Math.sqrt(2), Math.sqrt(2), 0)
        this.orthoCamera.lookAt(new THREE.Vector3())

        this.controls = new OrbitControls(
            this.orthoCamera,
            this.orthoRenderer.domElement
        )
        this.controls.enablePan = false

        let projWidth = this.projMount?.clientWidth || 100
        let projHeight = this.projMount?.clientHeight || 100

        this.projRenderer = new THREE.WebGLRenderer()
        this.projRenderer.setSize(projWidth, projHeight)

        this.plane = new PlaneHelper(
            new THREE.Plane(
                new THREE.Vector3(Math.sqrt(2), Math.sqrt(2), 0),
                1
            ),
            20,
            0x555555
        )

        this.pointGroup = new THREE.Group()
        this.lineGroup = new THREE.Group()

        this.animate = this.animate.bind(this)
        this.resize = this.resize.bind(this)

        window.addEventListener("resize", this.resize, false)
    }

    componentDidMount() {
        if (this.mount && !this.mount.contains(this.orthoRenderer.domElement)) {
            this.mount.appendChild(this.orthoRenderer.domElement)
        }

        if (
            this.projMount &&
            !this.projMount.contains(this.projRenderer.domElement)
        ) {
            this.projMount.appendChild(this.projRenderer.domElement)
        }

        this.resize()
        this.animate()
    }

    componentDidUpdate(prevProps) {
        this.resize()

        if (!this.props.scene?.children.includes(this.plane)) {
            this.props.scene.add(this.plane)
        }
        if (!this.props.scene?.children.includes(this.pointGroup)) {
            this.props.scene.add(this.pointGroup)
            this.setState({ groupReady: true })
        }
        if (!this.props.scene?.children.includes(this.lineGroup)) {
            this.props.scene.add(this.lineGroup)
            this.setState({ lineGroupReady: true })
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this._frame)

        if (this.mount && this.mount.contains(this.orthoRenderer?.domElement)) {
            this.mount.removeChild(this.orthoRenderer.domElement)
        }
    }

    resize() {
        let orthoWidth = this.mount?.clientWidth || 100
        let orthoHeight = this.mount?.clientHeight || 100

        // resize orthographic camera
        let frustumSize = 2
        this.orthoCamera.left = frustumSize / -2
        this.orthoCamera.right = frustumSize / 2
        this.orthoCamera.top = frustumSize / 2
        this.orthoCamera.bottom = frustumSize / -2
        this.orthoCamera.updateProjectionMatrix()

        // resize orthographic renderer
        if (orthoWidth > orthoHeight) {
            this.orthoRenderer.setSize(orthoHeight, orthoHeight)
        } else {
            this.orthoRenderer.setSize(orthoWidth, orthoWidth)
        }

        let projWidth = this.projMount?.clientWidth || 100
        let projHeight = this.projMount?.clientHeight || 100

        if (projWidth > projHeight) {
            this.projRenderer.setSize(projHeight, projHeight)
        } else {
            this.projRenderer.setSize(projWidth, projWidth)
        }
    }

    animate() {
        this._frame = requestAnimationFrame(this.animate)
        if (this.props.camera && this.props.scene) {
            this.controls.update()

            this.plane.visible = false
            this.pointGroup.visible = false
            this.lineGroup.visible = false
            this.orthoRenderer.render(this.props.scene, this.orthoCamera)

            this.plane.visible = true
            this.pointGroup.visible = true
            this.lineGroup.visible = true
            this.plane.plane.normal = new THREE.Vector3()
                .copy(this.orthoCamera.position)
                .normalize()
                .multiplyScalar(-1)
            this.projRenderer.render(this.props.scene, this.orthoCamera)
            if (!this.props.showPlane) {
                this.plane.visible = false
                this.pointGroup.visible = false
                this.lineGroup.visible = false
            }
        }
    }

    getProjectedPoints() {
        return this.props.points
            ? Object.keys(this.props.points).map((key) => (
                  <ProjectedPoint
                      id={key}
                      key={key}
                      plane={this.plane.plane}
                      group={
                          this.state.groupReady ? this.pointGroup : undefined
                      }
                  />
              ))
            : undefined
    }

    getProjectedLines() {
        let projectedLines = []
        let pointKeys = Object.keys(this.pointGroup.children)
        for (let i = 0; i < pointKeys.length; i++) {
            for (let j = i + 1; j < pointKeys.length; j++) {
                projectedLines.push(
                    <ProjectedLine
                        key={pointKeys[i] + "<->" + pointKeys[j]}
                        id1={
                            this.props.projectedPoints[
                                this.pointGroup.children[i].myID
                            ] && this.pointGroup.children[i].myID
                        }
                        id2={
                            this.props.projectedPoints[
                                this.pointGroup.children[j].myID
                            ] && this.pointGroup.children[j].myID
                        }
                        point1={this.pointGroup.children[i]}
                        point2={this.pointGroup.children[j]}
                        plane={this.plane.plane}
                        group={
                            this.state.lineGroupReady
                                ? this.lineGroup
                                : undefined
                        }
                    />
                )
            }
        }
        return projectedLines
    }

    render() {
        return (
            <>
                <div style={{ width: "100%", height: "100%", align: "left" }}>
                    <div
                        style={{
                            width: "calc(50% - 1px)",
                            height: "calc(100% - 8px)",
                            display: "inline-block",
                            paddingTop: "2px",
                            paddingBottom: "2px",
                        }}
                        className="ortho-renderer-div"
                        ref={(mount) => {
                            this.mount = mount
                        }}
                    >
                        <div
                            style={{
                                color: "white",
                                zIndex: "1",
                                margin: "4px",
                                marginLeft: "8px",
                                position: "fixed",
                            }}
                        >
                            <b>Orthographic View</b>
                        </div>
                    </div>
                    <div
                        style={{
                            width: "calc(50% - 1px)",
                            height: "calc(100% - 8px)",
                            display: "inline-block",
                            paddingTop: "2px",
                            paddingBottom: "2px",
                        }}
                        className="projection-renderer-div"
                        ref={(mount) => {
                            this.projMount = mount
                        }}
                    >
                        <div
                            style={{
                                color: "white",
                                zIndex: "1",
                                margin: "4px",
                                position: "fixed",
                            }}
                        >
                            <b style={{ backgroundColor: "black" }}>
                                Projection View
                            </b>
                        </div>
                    </div>
                </div>
                {this.getProjectedPoints()}
                {this.getProjectedLines()}
            </>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        points: state.points,
        scalar: state.scalar,
        showPlane: state.showPlane,
        projectedPoints: state.projectedPoints,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {}
}

const OrthoProjView = connect(
    mapStateToProps,
    mapDispatchToProps
)(OrthoProjViewClass)

export { OrthoProjView }
