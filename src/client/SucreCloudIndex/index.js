import React from "react";
import reactDom from "react-dom"
import App from "../../App/index.js"
//import {Link} from "react-router-dom"
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

//import nc from "../App/components/LiveStreaming/index.js"
//console.error(nc)

//OfflinePluginRuntime.install();
window.ol = (OfflinePluginRuntime);
//import nc from "../App/components/LiveStreaming/index.js"
//console.error(nc)

reactDom.render(<App/>,document.getElementById("app"));
