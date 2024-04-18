import { configureStore } from "@reduxjs/toolkit"

const actionTypes = {
    POINTS: "POINTS",
    SCALAR: "SCALAR",
    SHOW_AXES: "SHOW_AXES",
    SHOW_PLANE: "SHOW_PLANE",
    SELECTED_ID: "SELECTED_ID",
    DISTORT_COEFFICIENTS: "DISTORT_COEFFICIENTS",
}

const reducer = (
    state = {
        points: {
            default: {
                color: { r: 255, g: 0, b: 0 },
                euler: { x: -0.25, y: -1, z: 0.4 },
            },
        },
        scalar: 1,
        showAxes: true,
        showPlane: true,
        selectedID: "default",
        distortCoefficients: { r0: 0, r1: 0, r2: 0, r3: 0 },
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
        case actionTypes.DISTORT_COEFFICIENTS: {
            return { ...state, distortCoefficients: { ...action.payload } }
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

export function setDistortCoefficients(r0, r1, r2, r3) {
    return (dispatch, getState) => {
        dispatch({
            type: actionTypes.DISTORT_COEFFICIENTS,
            payload: { r0, r1, r2, r3 },
        })
    }
}

export default configureStore({ reducer })
