const CompressionPlugin = require("compression-webpack-plugin")
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OfflinePlugin = require('offline-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");
const minifyOpts = {}
const pluginOpts = {
	comments: false
}

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
export default [{
	name: "Pagina de HHCloud App",
	entry: {
		client: "./src/client/HHCloud/index.js",
		c:["react","react-dom","lodash"],
	},
	output: {
		globalObject: "this",
		hotUpdateChunkFilename: "[id].[hash].hot-update.js",
		//publicPath:"/dist",
		publicPath: '',
		filename: 'assets/js/[name].js',
		jsonpFunction: "_o",
		pathinfo: true,
		chunkFilename: 'assets/js/[name]_[chunkhash].js',

		path: path.resolve(__dirname, '../dist/SC')
	},
	devServer: {
		host: "localhost",
		port: 80,
		compress:true,
		clientLogLevel: 'info',
		//lazy: true,
		allowedHosts: ["*"],
		overlay: true,
		contentBase: path.resolve(__dirname, '../dist/SC'),
		publicPath: "/",
		hot: true,
		//hotOnly:true,
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
			"Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
		},
		//index:"src/components/api-sms/index.html",
		historyApiFallback: true
	},

	module: {

		rules: [{
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
			use: ["style-loader", 'css-loader', 'postcss-loader']
		}, {
			test: /\.less$/,
			use: ['css-loader', 'postcss-loader', 'less-loader']
		}, {
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader"
			}
		},{
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS
            ]
        }]
	},
	plugins: [
	/*new CompressionPlugin({
		asset: '[path].gz[query]',
		test: /\.jsx?/,
		cache: true,
		 algorithm: 'gzip',
	}),*/
	new OfflinePlugin({
		ServiceWorker:{
			entry:path.resolve(__dirname, 'SC-sw.js'),
			events: true,
			prefetchRequest:{credentials: 'include', mode: 'cors'}
		},
		AppCache: {
			FALLBACK: {
				'/SC/unidad': '/SC/'
			}
		},
		includeCrossOrigin:true,
		// Unless specified in webpack's configuration itself
		publicPath: '/SC/',
		appShell: '/SC/',
		externals: [
			'/api/',
			'/SC/',
			'/SC/unidad',
			'/SC/download',
		]
	}),
		new webpack.DefinePlugin({
			SIDE: JSON.stringify("client"),
			SERVICE_URL: JSON.stringify("http://orchi"),
			SERVICE_PORT: JSON.stringify(8080),
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),


		new HTMLWebpackPlugin({
			filname: "../dist/SC/index.html",
			title: 'Code Splitting',
			template: "src/client/HHCloud/index.html"
		}),
		new webpack.optimize.SplitChunksPlugin({
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all"
				}
			},
			name: true,
			automaticNameDelimiter: '~',
			chunks: "async",
		}),
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
		new webpack.SourceMapDevToolPlugin({
		  filename: '[name].map'
		})
		//new MinifyPlugin(minifyOpts, pluginOpts),
		//new webpack.HotModuleReplacementPlugin(),
		//cssExtract,
		//lessExtract
	]
},{
	name: "pagina inicio",
	entry: {
		client: "./src/client/IndexPage/index.js",
		c:["react","react-dom"],
	},
	output: {
		globalObject: "this",
		hotUpdateChunkFilename: "[id].[hash].hot-update.js",
		//publicPath:"/dist",
		publicPath: '',
		filename: 'assets/js/[name].js',
		jsonpFunction: "_o",
		pathinfo: true,
		chunkFilename: 'assets/js/[name]_[chunkhash].js',

		path: path.resolve(__dirname, '../dist')
	},
	devServer: {
		host: "localhost",
		port: 9090,
		allowedHosts: ["ubuntu", "*", "10.42.0.1"],
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

		rules: [{
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
			use: ["style-loader", 'css-loader', 'postcss-loader']
		}, {
			test: /\.less$/,
			use: ['css-loader', 'postcss-loader', 'less-loader']
		}, {
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: "babel-loader"
			}
		}]
	},
	plugins: [
		new OfflinePlugin({
			// Unless specified in webpack's configuration itself
			publicPath: '/',

			appShell: '/',
			externals: [
				'/'
			]
		}),
		new webpack.DefinePlugin({
			SIDE: JSON.stringify("client"),
			'process.env': {
				NODE_ENV: JSON.stringify(process.env.NODE_ENV)
			}
		}),


		new HTMLWebpackPlugin({
			filname: "../dist/index.html",
			title: 'Pagina de Inicio',
			template: "src/client/IndexPage/index.html"
		}),
		new webpack.optimize.SplitChunksPlugin({
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: "vendors",
					chunks: "all"
				}
			},
			name: true,
			automaticNameDelimiter: '~',
			chunks: "async",
		}),
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
}]
