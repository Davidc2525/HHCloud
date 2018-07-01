const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//hola
const MinifyPlugin = require("babel-minify-webpack-plugin");
const minifyOpts = {}
const pluginOpts = {comments:false}
 
var cssExtract = new ExtractTextPlugin({
	filename: 'css/[name]-[contenthash].css',
	allChunks: true
})
var lessExtract = new ExtractTextPlugin({
	filename: 'css/2-[name]-[contenthash].css',
	allChunks: true
})


var logincssExtract = new ExtractTextPlugin({
	filename: 'css/[name]-[contenthash].css',
	allChunks: true
})
var loginlessExtract = new ExtractTextPlugin({
	filename: 'css/2-[name]-[contenthash].css',
	allChunks: true
})

//webpack.optimize.splitChunks.chunks = "all"
console.log(new webpack.optimize.SplitChunksPlugin())

//npm i --save html-webpack-plugin extract-text-webpack-plugin babel-minify-webpack-plugin
export default {
    name:"pagina inicio SPA",
	entry: {
	   // c:["react","react-dom","semantic-ui-react","lodash"],
		client: "./src/client/index.js"
	},
	output: {
	    hotUpdateChunkFilename: "[id].[hash].hot-update.js",
		//publicPath:"/dist",
		publicPath: '',
		filename: 'assets/js/[name].js',
		jsonpFunction:"_o",
		pathinfo: true,
		chunkFilename: 'assets/js/[name]_[chunkhash].js',

		path: path.resolve(__dirname, '../dist')
	},
	devServer: {
		host:"orchi",
		port:9090,
		allowedHosts:["ubuntu","*","10.42.0.1"],
		overlay: true,
		contentBase: path.resolve(__dirname, '../dist'),
		publicPath: "/",
		hot: true,
		 headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
          "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
		//index:"src/components/api-sms/index.html",
		historyApiFallback: true
	},

	module: {

		rules: [
		{
		    test: /\.(gif|jpg|png|svg)$/,
		    loader: 'url-loader',
		    options: {
			    limit: 65000,
		    }
		}, {
			test: /\.svg$/,
			loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=/fonts/[name].[ext]'
		}, {
			test: /\.woff$/,
			loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=/fonts/[name].[ext]'
		}, {
			test: /\.woff2$/,
			loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=/fonts/[name].[ext]'
		}, {
			test: /\.[ot]tf$/,
			loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=/fonts/[name].[ext]'
		}, {
			test: /\.eot$/,
			loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=/fonts/[name].[ext]'
		}, {
			test: /\.css$/,
			use: ["style-loader",'css-loader', 'postcss-loader']
		}, {
			test: /\.less$/,
			use: ['css-loader', 'postcss-loader','less-loader']
		},
		{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader"
            }
          }]
	},plugins: [
	    new webpack.DefinePlugin({
	    SIDE: JSON.stringify("client"),
          'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
          }
        }),


		new HTMLWebpackPlugin({
		   filname:"../dist/index.html",
            title: 'Code Splitting',
            template:"src/client/index.html"
         }),
         new webpack.optimize.SplitChunksPlugin({
            cacheGroups: {
               commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            },
            name:true,automaticNameDelimiter: '~', chunks: "async",}),
		//webpack.optimize.splitChunks,
		/*new webpack.optimize.UglifyJsPlugin({
			parallel: {
				cache: true,
				workers: 5 // for e.g
			},
			uglifyOptions: {
				compress:true,
				mangle:true,
				ie8: true,
				ecma: 8
			},
			output: {
				comments: false,
				beautify: false
			}
		}),*/
		 new webpack.NamedModulesPlugin(),
         new webpack.HotModuleReplacementPlugin(),
		//new MinifyPlugin(minifyOpts, pluginOpts),
		//new webpack.HotModuleReplacementPlugin(),
		//cssExtract,
		//lessExtract
	]
}
