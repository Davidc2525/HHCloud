  const getParent = (path = "/") => {
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
  	return isRoot(path) ? path : (path.replace(/\/{2,}/ig, "/")).replace(/(\/?){1,}$/ig,"")
  }

  const isRoot = (path)=>{
  	return path == "/"
  }
  window.gp = getParent
  window.mp = mergePath
  window.gn = getName
  export {
  	getName,
  	getParent,
  	mergePath
  }