const { defineConfig } = require("@vue/cli-service");



module.exports = defineConfig({

  transpileDependencies: true,

  publicPath: "/", 

  devServer: {

    proxy: {

      "/api": {

        target: "https://api.themoviedb.org/3",

        changeOrigin: true,

        pathRewrite: { "^/api": "" },

      },

    },

  },

});
