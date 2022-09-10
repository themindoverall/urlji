// We import the CSS which is extracted to its own file by esbuild.
// Remove this line if you add a your own CSS build pipeline (e.g postcss).
import "../css/app.css"

import React from "react"
import ReactDOM from "react-dom/client"
import Index from "./index"

const $app = document.getElementById("app");
const root = ReactDOM.createRoot($app);
root.render(React.createElement(Index));
