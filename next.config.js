/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental:{serverActions:true,swcMinify:true},
    images:{
        formats:["image/avif","image/webp"],
        domains:["swiperjs.com","utfs.io","s3.amazonaws.com","*"],
    
    },
    swcMinify:true,

}

module.exports = nextConfig
 