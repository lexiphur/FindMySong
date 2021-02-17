const path = require('path');
const webpack = require("webpack");

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    mode: process.env.NODE_ENV,
    devServer: {
      publicPath: '/build',
      proxy: {
        '/anime': 'http://localhost:3000',
        '/found': 'http://localhost:3000',
        '/': 'http://localhost:3000',
        '/login': 'http://localhost:3000'
    },
      port:8080
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            resolve: { extensions: ["*", ".js", ".jsx"] },
            loader: "babel-loader",
            options: { presets: ["@babel/env"] }
          },
          {
            test: /.css/,
            exclude: /node_modules/,
            use: ['style-loader', 'css-loader'],
          }
        ]
    },
    
    
}