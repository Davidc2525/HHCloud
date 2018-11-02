  /**get parent with indexOf instead spliting and join*/
  const gp = (p="/") => {
    const index = p.lastIndexOf("/");
    const path = p || "/"
    if (index == -1) {
      return "/"
    }
    if (index == 0) {
      return path.substring(index, 1)
    } else {
      return path.substring(0, index)
    }
  }

  const getParent = (path = "/") => {
    return gp(path);

  	let p = path.split("/").filter(x => x != "")

  	let parentPath = p.slice(0, p.length - 1).join("/")
  	var start = "/"
  	if (parentPath[0] == "/") {
  		start = ""
  	} else if (parentPath != "") {
  		start = ""
  	}
  	return isRoot(path) ? path : tryNormalize("/" + parentPath)
  }

  const getName = path => {
  	let ps=path.split("/").filter( _ => _ != "")
  	let name = ps.slice(ps.length-1,ps.length).join("");
  	return name == "" ? null:name

  }

  const mergePath = (path1, path2) => {
  	return  tryNormalize(path1 + "/" + path2)
  }

  const tryNormalize=(path)=>{
  	return isRoot(path) ? path : (path.replace(/\/{2,}/ig, "/")).replace(/(\/?){1,}$/ig,"").replace(/(\/+)$/ig,"")
  }

  const isRoot = (path)=>{
  	return path == "/"
  }

  const parsePath = (hashPath="#/")=>{
  	var p = hashPath;
	return p.substring(p.indexOf("#")+1);
  	//return hashPath.split("#")[1]
  }

  const locationToObject = _ => {
    var obj = {};
    var ignore = ["replace", "reload", "assign", "ancestorOrigins"];
    Object.keys(location).filter(x => !ignore.includes(x)).forEach(x => {
      obj[x] = location[x];
    })
    obj.toString = _ => obj.href;
    return obj;
  }

  const parseSharePath = (entry) => {

    let parts;

    try {
      entry = atob(entry)
    } catch (e) {
      console.warn("La entrada no esta codificada como BASE64")
    }

    if (entry.indexOf("::") == -1) {
      throw "entrada mal formada";
    }

    parts = entry.split("::");

    return {
      owner: parts[0],
      spath: parts[1]
    }
  }

const getAppLocation = pathname => {
  return pathname.substring(pathname.lastIndexOf("/") + 1)
}

const locationToData = lt => {
  var l = locationToObject(lt);
  var p = l.hash;
  var search = l.search;

  var owner = null;
  var spath = null;
  var subpath = null;

  var qs = new URLSearchParams(search);
  if (qs.has("s")) {
    search = qs.get("s");
    var parsed = parseSharePath(search);
    owner = parsed.owner
    search = parsed.spath;
    spath = search;
    subpath = parsePath(p)
    p = spath + "/" + subpath;
  }

  var currentPath = tryNormalize(parsePath(p))
  //;p.substring(p.indexOf("#")+1);//props.location.hash.split("#")[1];//parse(props.location.search).path
  try {
    currentPath = decodeURIComponent(currentPath);
  } catch (e) {
    console.error(e)
  }

  var currentPathWithUser = btoa(owner).replace(/=/ig,"") + "@" + currentPath;
  var applocation = getAppLocation(location.pathname)

  return {
    owner,
    spath,
    subpath,
    applocation,
    currentPath,
    currentPathWithUser,
    ...l
  }

}


  /**
  

  window.tn = tryNormalize
  window.pp = parsePath
  window.gp = getParent
  window.mp = mergePath
  window.gn = getName*/
  export {
    getAppLocation,
    locationToData,
    parseSharePath,
    locationToObject,
    isRoot,
    tryNormalize,
    parsePath,
    getName,
    getParent,
    mergePath
  }