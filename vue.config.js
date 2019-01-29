module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://v3i.minicart.cn',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/ydxx': {
                target: 'http://hcdc.ydxxtech.com/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/ydxx': ''
                }
            }
        }
    },
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/"
}