import {
    fromJS,
    Map,
    List
} from "immutable"

const state = {
    namecomponent: "shared_with_me",

    status: "pristine",//loaded, loading, error,pristine

    littleMsg:{
    	open:false,
    	msg:""
    },
    shared:{}
}
export default fromJS(state)