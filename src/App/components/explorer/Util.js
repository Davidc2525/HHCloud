  /**get parent with indexOf instead spliting and join*/
  const gp = p => {
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
  window.gp = getParent
  window.mp = mergePath
  window.gn = getName
  export {
  	tryNormalize,
  	parsePath,
  	getName,
  	getParent,
  	mergePath
  }