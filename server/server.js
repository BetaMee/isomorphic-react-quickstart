import path from 'path';
import express from 'express';
import config from 'config-lite';
import webpack from 'webpack';
import bodyParser from 'body-parser';
import winston from 'winston';//日志
import expressWinston from 'express-winston';
//react服务端渲染配置
import React from 'react';
import {Provider} from 'react-redux';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import configureStore from '../common/store/store';

import ApiRoutes from './api';//服务端api路由
import AppRoutes from '../common/AppRoutes';//前端路由

import renderFullPage from './lib/view';
import getInitialData from './lib/helper';


var app = express();
// 设置静态文件目录
if(process.env.NODE_ENV === 'development') {
	const webpackconfig = require('../webpack.config.dev');
	const compiler = webpack(webpackconfig);
	app.use(require('webpack-dev-middleware')(compiler, {
		noInfo: true,
		publicPath: webpackconfig.output.publicPath,
		stats: {
			assets: false,
			colors: true,
			version: false,
			hash: false,
			timings: false,
			chunks: false,
			chunkModules: false
		}
	}));
	app.use(require('webpack-hot-middleware')(compiler));
	app.use(express.static(path.resolve(__dirname,'../client')));//与webpack.dev中一致
	app.use(express.static(path.join(__dirname, 'public')));  
} else if(process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, 'public')));
}


//处理fetch请求的json数据
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: './logs/success.log'
    })
  ]
}));


// RESTful API路由
ApiRoutes(app);


app.get('*',(req, res)=>{

  match( {routes:AppRoutes, location:req.url}, (err, redirectLocation, renderProps)=>{
    
    if(err) {
      res.status(500).send(err.message);
    }else if(redirectLocation) {
      console.log("redirection");
      res.redirect(302,redirectLocation.pathname+redirectLocation.search);
    }else if(renderProps) {

      getInitialData(req.url)
        .then(initialState=>{        
          const store = configureStore(initialState);
          let marked = renderToString(
              <Provider store={store}>
                <RouterContext {...renderProps}/>
              </Provider>
          );
          const initHtml = renderFullPage(marked,store.getState(),process.env.NODE_ENV);
          res.status(200).end(initHtml);
        })
        .catch(err=>{
          console.log(err.message);
          res.send(err.message);
        });
    }else{
      res.status(404).end('404 not found');
    }
  });
});





// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));


  app.listen(config.port, function () {
    console.log(`app listening on port ${config.port}`);
  });

