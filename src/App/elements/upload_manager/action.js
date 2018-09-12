//@
import { Upload } from "./Upload";
const ADD_UPLOAD    = "@UPLOAD_MANAGER/ADD_UPLOAD";
const END_UPLOAD    = "@UPLOAD_MANAGER/END_UPLOAD";
const UPDATE_UPLOAD = "@UPLOAD_MANAGER/UPDATE_UPLOAD";
const INCREMENT_FILE_UPLOADED = "@UPLOAD_MANAGER/INCREMENT_FILE_UPLOADED";
const UPLOAD_MANAGER = "@UPLOAD_MANAGER/UPLOAD_MANAGER"


const addUpload = (item: Upload) => ({
    type: ADD_UPLOAD,
    middle: UPLOAD_MANAGER,
    upId: item.getId(),
    path: item.getPath(),
    up: item
})

const endUpload = (item: Upload) => ({
    type: END_UPLOAD,
    middle: UPLOAD_MANAGER,
    upId: item.getId(),
    up:item
})


const updateUpload = (item: Upload) => ({
    type: UPDATE_UPLOAD,
    middle: UPLOAD_MANAGER,
    upId: item.getId(),
    up:item
})

const incrementFileUploaded = (item: Upload, file: File) => ({
    type: INCREMENT_FILE_UPLOADED,
    middle: UPLOAD_MANAGER,
    upId: item.getId(),
    up:item,
    file
})

export {
    INCREMENT_FILE_UPLOADED,
    UPDATE_UPLOAD,
    END_UPLOAD,
    UPLOAD_MANAGER,
    ADD_UPLOAD,
    incrementFileUploaded,
    addUpload,
    endUpload,
    updateUpload
}