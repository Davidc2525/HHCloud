import * as OfflinePluginRuntime from 'offline-plugin/runtime';
import React from "react";
import reactDom from "react-dom";
import App from "../../App/index.js";

if (process.env.NODE_ENV == "production") {
    OfflinePluginRuntime.install();
}

reactDom.render(<App />, document.getElementById("app"));
