import { configureStore } from "@reduxjs/toolkit"

const actionTypes = {
    POINTS: "POINTS",
    SCALAR: "SCALAR",
    SHOW_AXES: "SHOW_AXES",
    SHOW_PLANE: "SHOW_PLANE",
    SELECTED_ID: "SELECTED_ID",
    PROJECTED_POINTS: "PROJECTED_POINTS",
}

const reducer = (
    state = {
        points: {
            default: {
                phi: -0.7854,
                theta: 0.7854,
                color: { r: 255, g: 0, b: 0 },
            },
        },
        scalar: 1,
        showAxes: true,
        showPlane: false,
        selectedID: "default",
        projectedPoints: {},
    },
    action
) => {
    switch (action.type) {
        case actionTypes.POINTS: {
            return {
                ...state,
                points: {
                    ...action.payload,
                },
            }
        }
        case actionTypes.SCALAR: {
            return { ...state, scalar: action.payload }
        }
        case actionTypes.SHOW_AXES: {
            return { ...state, showAxes: action.payload }
        }
        case actionTypes.SHOW_PLANE: {
            return { ...state, showPlane: action.payload }
        }
        case actionTypes.SELECTED_ID: {
            return { ...state, selectedID: action.payload }
        }
        case actionTypes.PROJECTED_POINTS: {
            return { ...state, projectedPoints: { ...action.payload } }
        }
        default:
            return state
    }
}

export function setPoint(id, point) {
    return (dispatch, getState) => {
        const points = getState().points
        dispatch({
            type: actionTypes.POINTS,
            payload: { ...points, [id]: point },
        })
    }
}

export function setScalar(scalar) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.SCALAR, payload: scalar })
    }
}

export function setSelectedID(id) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.SELECTED_ID, payload: id })
    }
}

export function setShowAxes(show) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.SHOW_AXES, payload: show })
    }
}

export function setShowPlane(show) {
    return (dispatch, getState) => {
        dispatch({ type: actionTypes.SHOW_PLANE, payload: show })
    }
}

export function setProjectedPoint(id, projectedPoint) {
    return (dispatch, getState) => {
        const projectedPoints = getState().projectedPoints
        dispatch({
            type: actionTypes.PROJECTED_POINTS,
            payload: { ...projectedPoints, [id]: projectedPoint },
        })
    }
}

export default configureStore({ reducer })
