module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "/lcckksh/" : "/",
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: ['all']
  }
}