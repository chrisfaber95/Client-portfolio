module.exports = {
    lintOnSave: false,
    devServer: {
        disableHostCheck: true,
        https: true
    },
    chainWebpack: config => {
        /* config.plugins.delete('pwa');
         config.plugins.delete('workbox');*/
        config.module.rule('pdf')
            .test(/\.pdf$/)
            .use('file-loader').loader('file-loader')
    },
    pwa: {
        name: 'Coop Lubbers Online',
        themeColor: '#11BA87',
        msTileColor: '#000000',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black',
    }
}