import React from "react"
import { connect } from "react-redux"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

import { Point } from "./Point.js"
import { GreatCircle } from "./GreatCircle.js"
import { OrthoProjView } from "./OrthoProjView.js"

class ThreeSceneClass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.scene = new THREE.Scene()

        let width = this.mount?.clientWidth || 100
        let height = this.mount?.clientHeight || 100

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
        this.camera.position.x = 2
        this.camera.position.y = 2
        this.camera.position.z = 2
        this.camera.up.set(0, 0, 1)

        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enablePan = false
        this.controls.minDistance = 1.25

        this.axesHelper = new THREE.AxesHelper(2)
        this.axesHelper.setColors(0xdddddd, 0xdddddd, 0xdddddd)
        this.axesHelper.visible = this.props.showAxes
        this.scene.add(this.axesHelper)

        let sphere = new THREE.Mesh(
            new THREE.SphereGeometry(1, 64, 64),
            new THREE.MeshBasicMaterial({
                side: THREE.BackSide,
                transparent: true,
                opacity: 0.3,
            })
        )
        this.scene.add(sphere)

        this.animate = this.animate.bind(this)
        this.resize = this.resize.bind(this)

        window.addEventListener("resize", this.resize, false)
    }

    componentDidMount() {
        if (this.mount && !this.mount.contains(this.renderer.domElement)) {
            this.mount.appendChild(this.renderer.domElement)
        }

        this.setState({ ready: true })
        this._isMounted = true
        this.resize()
        this.animate()
    }

    componentDidUpdate(prevProps) {
        if (this.props.showAxes !== prevProps.showAxes) {
            this.axesHelper.visible = this.props.showAxes
        }
    }

    componentWillUnmount() {
        this._isMounted = false
        cancelAnimationFrame(this._frame)

        if (this.mount && this.mount.contains(this.renderer?.domElement)) {
            this.mount.removeChild(this.renderer.domElement)
        }
    }

    resize() {
        // styling stuff
        let w = this.ref?.clientWidth || 200
        let h = this.ref?.clientHeight || 200
        if (this._isMounted) {
            this.setState({ width: w, height: h })
        }

        let width = w
        let height = h - w / 2

        // resize perspective camera
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()

        // resize perspective renderer
        this.renderer.setSize(width, height)
    }

    animate() {
        this._frame = requestAnimationFrame(this.animate)
        this.controls?.update()
        this.renderer?.render(this.scene, this.camera)
    }

    getGreatCircles() {
        let greatCircleComponents = []
        let pointKeys = Object.keys(this.props.points)
        for (let i = 0; i < pointKeys.length; i++) {
            for (let j = i + 1; j < pointKeys.length; j++) {
                greatCircleComponents.push(
                    <GreatCircle
                        key={pointKeys[i] + pointKeys[j]}
                        id1={pointKeys[i]}
                        id2={pointKeys[j]}
                        scene={this.state.ready ? this.scene : undefined}
                    />
                )
            }
        }
        return greatCircleComponents
    }

    render() {
        return (
            <div
                style={{ width: "100%", height: "100%" }}
                ref={(ref) => {
                    if (!this.ref) {
                        this.ref = ref
                        this.resize()
                    }
                }}
            >
                <div
                    className="renderer-div"
                    style={{
                        width: "100%",
                        height: "calc(100% - " + this.state.width / 2 + "px)",
                    }}
                    ref={(mount) => {
                        this.mount = mount
                    }}
                >
                    <div
                        style={{
                            color: "white",
                            zIndex: "1",
                            margin: "4px",
                            position: "absolute",
                        }}
                    >
                        <b>Perspective View (click and drag to adjust)</b>
                    </div>
                    {this.props.points
                        ? Object.keys(this.props.points).map((key) => (
                              <Point
                                  id={key}
                                  key={key}
                                  scene={
                                      this.state.ready ? this.scene : undefined
                                  }
                              />
                          ))
                        : undefined}
                    {this.props.points ? this.getGreatCircles() : undefined}
                </div>
                <div
                    style={{
                        width: "100%",
                        height: this.state.width / 2 + "px",
                    }}
                >
                    <OrthoProjView
                        scene={this.state.ready ? this.scene : undefined}
                        camera={this.state.ready ? this.camera : undefined}
                    />
                </div>
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        points: state.points,
        showAxes: state.showAxes,
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {}
}

const ThreeScene = connect(mapStateToProps, mapDispatchToProps)(ThreeSceneClass)

export { ThreeScene }
