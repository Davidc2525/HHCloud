const MIDDLE = "SHARED-WITH-ME";

const ACTIONS = {
    OPEN_LITLE_MSG :{
        NAME: "share-w-m@OPEN_LITLE_MSG",
        FUN:function(msg){
            return {
                type: this.NAME,
                middle:MIDDLE,
                payload:{
                    msg
                }
            }
        }
    },
    CLOSE_LITLE_MSG :{
        NAME: "share-w-m@CLOSE_LITLE_MSG",
        FUN:function(){
            return {
                type: this.NAME,
                middle:MIDDLE,
            }
        }
    },
    
    FETCHING_SHARED :{
        NAME: "share-w-m@FETCHING_SHARED",
        FUN:function(){
            return {
                type: this.NAME,
                middle:MIDDLE,
                status:"loading"
            }
        }
    },
    FETCHED_SHARED : {
        NAME: "share-w-m@FETCHED_SHARED",
        FUN: function(payload,status="loading"){
            return ({
                type: this.NAME,
                status: status,               
                middle: MIDDLE,
                payload
            })
        }
    },
    DELETING_SHARE: {
        NAME:"share-w-m@DELETING_SHARE",
        FUN: function(owner,path){
           return ({
               type: this.NAME, 
               middle: MIDDLE,
               payload:{
                   path,
                   owner
               }
           })  
        }
    },
    DELETED_SHARE: {
        NAME: "share-w-m@DELETED_SHARE",
        FUN: function (owner, path) {
            return ({
                type: this.NAME,
                middle: MIDDLE,
                payload: {
                    path,
                    owner
                }
            })
        }
    },
    COPYGING_SHARE: {
        NAME: "share-w-m@COPYGING_SHARE",
        FUN: function (owner, spath,srcpath,dstpath) {
            return ({
                type: this.NAME,
                middle: MIDDLE,
                payload: {
                    owner, spath, srcpath, dstpath
                }
            })
        }
    },
    COPIED_SHARE: {
        NAME: "share-w-m@COPIED_SHARE",
        FUN: function (owner, spath, srcpath, dstpath) {
            return ({
                type: this.NAME,
                middle: MIDDLE,
                payload: {
                    owner, spath, srcpath, dstpath
                }
            })
        }
    }
}



export {
    MIDDLE,
    ACTIONS
}