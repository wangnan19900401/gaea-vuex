const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const config = require('./package.json');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const curDate = new Date();
const curTime = curDate.getFullYear() + '/' + (curDate.getMonth() + 1) + '/' + curDate.getDate() + ' ' + curDate.getHours() + ':' + curDate.getMinutes() + ':' + curDate.getSeconds();

const bannerTxt = config.name + ' ' + config.version + ' ' + curTime; 

const vendorStr = "{{bucket}}";

let vendor = ['vue'];
vendor = vendor.concat(vendorStr.split(','));
let vendordev=['vue/dist/vue.esm.js'];
vendordev =vendordev.concat(vendorStr.split(','));


module.exports = {
	//你想要打包的模块数组
	entry:{
		vendor:vendor,
		vendordev:vendordev
	},
	output:{
		path:path.join(__dirname,'/static/'),
		filename:'[name].dll.js',
		library:'[name]_library'
		//vendor.dll.js 中暴露出的全局变量
		//主要是给DllPlugin中的name 使用
		//故这里需要和webpack.DllPlugin 中的 'name :[name]_libray 保持一致
	},
	plugins:[
		new CleanWebpackPlugin(['static','vendor-manifest.json','vendordev-manifest.json']),
		new webpack.DllPlugin({
			path:path.join(__dirname,'.','[name]-manifest.json'),
			name:'[name]_library',
			context:__dirname
		}),
		new UglifyJsPlugin({
            cache:true,
            sourceMap:false,
            parallel:4,
            uglifyOptions: {
                ecma:8,
                warnings:false,
                compress:{
                    drop_console:true,
                },
                output:{
                    comments:false,
                    beautify:false,
                }
            }
        }),
        new webpack.BannerPlugin(bannerTxt)
	]
}