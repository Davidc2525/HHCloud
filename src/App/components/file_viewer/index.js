
import React,{Component} from "react"
import fileextension from "file-extension"
//var Prism = require('prismjs');
var Prism = require('./prism.js');


 
import   "./prism.css"
import PrismCode from "react-prism"
console.warn(Prism)
// The code snippet you want to highlight, as a string
var code = `

package orchi.SucreCloud.operations;

import java.awt.List;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.AsyncContext;
import javax.servlet.http.HttpServletResponse;

import org.apache.hadoop.fs.FileStatus;
import org.apache.hadoop.fs.FileSystem;
import org.apache.hadoop.fs.Path;
import org.json.JSONException;
import org.json.JSONObject;
import org.slf4j.*;

import orchi.SucreCloud.hdfs.HdfsManager;
import orchi.SucreCloud.hdfs.ZipFiles;

public class DownloadOperation implements IOperation {
	private static Logger log = LoggerFactory.getLogger(DownloadOperation.class);
	private static FileSystem fs = HdfsManager.getInstance().fs;

	public DownloadOperation() {
	}

	public DownloadOperation(AsyncContext ctx, JSONObject arg) {
		log.info("Nueva operacion de descarga.");
		//fs = HdfsManager.getInstance().fs;
		String root = arg.getString("root");
		String path = arg.getString("path");
		Path opath = new Path(HdfsManager.newPath(root, path).toString());
		HttpServletResponse r = ((HttpServletResponse) ctx.getResponse());

		try {
			if (!fs.exists(opath)) {
				log.info("{} no existe",opath.toString());
				ctx.getResponse().getWriter().println("no exists" + opath.toString());
				log.info("Operacion de descarga terminada {}",opath.toString());
				ctx.complete();
			}
			if (fs.isFile(opath)) {
				log.info("Descargar archivo {}",opath.toString());
				FileStatus fileStatus = fs.getFileLinkStatus(opath);
				System.out.println("		" + fileStatus.getPath().getName());
				r.addHeader("Content-Disposition", " attachment; filename=\"" + fileStatus.getPath().getName() + "\"");

				HdfsManager.getInstance().readFile(opath, ctx.getResponse().getOutputStream());
				// ctx.getResponse().getWriter().println( opath.toString() );
				log.info("Operacion de descarga terminada {}",opath.toString());
				ctx.complete();
			}

			if (fs.isDirectory(opath)) {
				log.info("Descargar directorio {}",opath.toString());

				//r.addHeader("Transfer-Encoding","gzip");
				r.addHeader("Content-Disposition", " attachment; filename=\"" + opath.getName() + ".zip\"");

				Tree tree = new Tree(opath);
				ZipFiles zip = new ZipFiles(tree, ctx.getResponse().getOutputStream());
				zip = null;
				tree = null;

				log.info("Operacion de descarga terminada {}",opath.toString());
				// ctx.getResponse().getWriter().println("descargar carpeta");
				ctx.complete();
			}

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public JSONObject call() {

		return null;
	}

	public static class Tree {

		public ArrayList<String> dirs = new ArrayList<String>();;
		public Long totalSize = 0L;
		public Tree(Path path) {
			log.info("new  tree");
			get(path);

		}

		public void get(Path path) {
			log.info("get path {}",path.toString());
			try {
				for (FileStatus item : fs.listStatus(path)) {
					if (item.isFile()) {
						dirs.add(item.getPath().toString());
						totalSize+=item.getLen();
						log.info("\tadd to tree {}",item.getPath().toString());
					}
					if (item.isDirectory()) {
						get(item.getPath());
					}
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}

`;

// Returns a highlighted HTML string
var html = Prism.highlight(code, Prism.languages["java"]);
class FileViewer extends Component{
	constructor(props){super(props)}


	render(){
		return <pre><code><div dangerouslySetInnerHTML={{__html:html}}/></code></pre>
		//return <div><PrismCode> var a = 1 </PrismCode></div>
	}
}

export default FileViewer;