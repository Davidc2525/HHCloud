import React from "react";
import reactDom from "react-dom"
//import {Link} from "react-router-dom"
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import WellcomePage from "../../App/components_to_page_index/wellcomePage/index.jsx"
//import nc from "../App/components/LiveStreaming/index.js"
//console.error(nc)

OfflinePluginRuntime.install();

reactDom.render(<WellcomePage/>,document.getElementById("app"));
