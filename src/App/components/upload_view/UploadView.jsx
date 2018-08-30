//@ts-check
import React, { Component } from "react";
import { connect } from "react-redux";
import { Map } from "immutable";
import { UploadManagerInstance } from "../../elements/upload_manager/index.js";
//@ts-ignore
@connect((state: Map, props) => {
    //let downloadState = state.get("downloads")
    let uploads = state.get("uploads").get("uploads")

    return { count: uploads.count(), uploads: uploads.toJS() }
})
class UploadView extends Component {
    constructor(props) {
        super(props);
    }

    _renderUps(id: string): JSX.Element {
        let up = UploadManagerInstance.instance.getUpload(id);
        if(up==null){
            return <div></div>
        }

        let files = up.getFiles();
        return (
            <div>
                id: {up.getId()}, path: {up.getPath()}, type: {up.getType()}, count {files.length}, uploades {up.getUploades()}
                {/*files.map(x => <div>{x.webkitRelativePath}/{x.name}</div>)*/}
            </div>
        )
    }
    render() {
        const { count, uploads } = this.props;

        return (
            <div>
                Visor de subidas
                cantidad de subidas {count}
                {count > 0 &&
                    <div>
                        {Object.keys(uploads).map((x) =>
                            <div>{this._renderUps(x)}<hr /></div>
                        )}
                    </div>
                }
            </div>
        )
    }
}

export { UploadView };
export default UploadView