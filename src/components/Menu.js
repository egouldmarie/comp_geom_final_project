import React from "react"
import { connect } from "react-redux"

import { ColorPicker } from "primereact/colorpicker"

import {
    setPoint,
    setScalar,
    setShowAxes,
    setShowPlane,
    setSelectedID,
} from "../store.js"

import { makeID } from "../utils/utils.js"

class MenuClass extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            keepInHemisphere: true,
        }
    }

    addPoint() {
        let id = makeID(6)
        let phi = -(Math.PI / 2) * Math.random()
        let theta = 2 * Math.PI * Math.random()
        let color = {
            r: Math.floor(255 * Math.random()),
            g: Math.floor(255 * Math.random()),
            b: Math.floor(255 * Math.random()),
        }
        this.props.setPoint(id, { phi, theta, color })
        this.props.setSelectedID(id)
    }

    render() {
        return (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    color: "white",
                    border: "solid 2px white",
                    backgroundColor: "black",
                }}
            >
                <br />
                <b>Selected Point</b>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <select
                    value={this.props.selectedID}
                    onChange={(e) => {
                        this.props.setSelectedID(e.target.value)
                    }}
                >
                    {this.props.points
                        ? Object.keys(this.props.points).map((key) => (
                              <option key={key} value={key}>
                                  {key}
                              </option>
                          ))
                        : undefined}
                </select>
                <br />
                <br />
                {this.props.selectedPoint ? (
                    <span>
                        <b>color</b>
                        &nbsp;
                        <ColorPicker
                            format="rgb"
                            value={{
                                r: this.props.selectedPoint.color.r,
                                g: this.props.selectedPoint.color.g,
                                b: this.props.selectedPoint.color.b,
                            }}
                            onChange={(e) => {
                                this.props.setPoint(this.props.selectedID, {
                                    ...this.props.selectedPoint,
                                    color: {
                                        r: e.target.value.r,
                                        g: e.target.value.g,
                                        b: e.target.value.b,
                                    },
                                })
                            }}
                        />
                        <br />
                        <br />
                        <b>Phi</b>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            min={-Math.PI / 2 + 0.001}
                            max={Math.PI / 2}
                            type="number"
                            step={0.04}
                            value={-this.props.selectedPoint.phi}
                            onChange={(e) => {
                                this.props.setPoint(this.props.selectedID, {
                                    ...this.props.selectedPoint,
                                    phi: -e.target.value,
                                })
                            }}
                        />
                        <br />
                        <b>Theta</b>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <input
                            min={-Math.PI}
                            max={Math.PI}
                            type="number"
                            step={0.05}
                            value={this.props.selectedPoint.theta}
                            onChange={(e) => {
                                this.props.setPoint(this.props.selectedID, {
                                    ...this.props.selectedPoint,
                                    theta: e.target.value,
                                })
                            }}
                        />
                        <br />
                        <br />
                        <button
                            onClick={() => {
                                this.addPoint()
                            }}
                        >
                            Add Point
                        </button>
                        <br />
                    </span>
                ) : undefined}
                <br />
                <b> Show Axes</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                    type="checkbox"
                    checked={this.props.showAxes}
                    onChange={(e) => {
                        this.props.setShowAxes(e.target.checked)
                    }}
                />
                <br />
                <b>Show Plane</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                    type="checkbox"
                    checked={this.props.showPlane}
                    onChange={(e) => {
                        this.props.setShowPlane(e.target.checked)
                    }}
                />
            </div>
        )
    }
}

function mapStateToProps(state, ownProps) {
    return {
        points: state.points,
        scalar: state.scalar,
        showAxes: state.showAxes,
        showPlane: state.showPlane,
        selectedID: state.selectedID,
        selectedPoint: state.points?.[state.selectedID],
    }
}

function mapDispatchToProps(dispatch, ownProps) {
    return {
        setPoint: (id, point) => dispatch(setPoint(id, point)),
        setScalar: (scalar) => dispatch(setScalar(scalar)),
        setShowAxes: (show) => dispatch(setShowAxes(show)),
        setShowPlane: (show) => dispatch(setShowPlane(show)),
        setSelectedID: (id) => dispatch(setSelectedID(id)),
    }
}

const Menu = connect(mapStateToProps, mapDispatchToProps)(MenuClass)

export { Menu }
