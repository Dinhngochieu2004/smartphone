module.exports ={
    port: process.env.SERVER_PORT || 8000,
    prefixApiVersion: process.env.API_VERSION ||'/api/v1',
    baseImageUrl: process.env.BASE_IMAGE_URL || `${__dirname}/../src/public/uploads/images`,
    jwtAccesskey: process.env.JWT_ACCESS_KEY || "hieu-access-key",
    jwtRefreshkey: process.env.JWT_REFRESH_KEY || "hieu-refresh-key",
    viewsFolder: `${__dirname}/../src/apps/views`,
    viewEngine: "ejs", 
}