// // next.config.js
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     // reactStrictMode: true,
//     output: 'export' 
//   };
  
//   export default nextConfig;
  

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Hapus output: 'export'
    experimental: {
    appDir: true,
  },
  };
  
  export default nextConfig;
  