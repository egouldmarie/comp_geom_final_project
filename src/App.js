import React from "react"
import "./App.css"

import { Menu } from "./components/Menu.js"
import { ThreeScene } from "./components/ThreeScene.js"

export class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
    }

    render() {
        let menuWidth = 268
        return (
            <div className="App">
                <div
                    style={{
                        top: "0px",
                        width: menuWidth + "px",
                        height: "calc(100vh - 5px)",
                        position: "absolute",
                    }}
                >
                    <Menu />
                </div>
                <div
                    id="parentID"
                    style={{
                        top: "0px",
                        left: menuWidth + 4 + "px",
                        width: "calc(100vw - " + (menuWidth - 2) + "px)",
                        height: "100vh",
                        position: "absolute",
                    }}
                >
                    <ThreeScene />
                </div>
            </div>
        )
    }
}

export default App
