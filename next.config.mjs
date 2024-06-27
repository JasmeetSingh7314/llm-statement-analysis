/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/ocr/:path*",
        destination: "http://localhost:4000/api/ocr/:path*",
      },
      {
        source: "/citations/:path*",
        destination: "http://localhost:4000/api/citations/:path*",
      },
      {
        source: "/questions/:path*",
        destination: "http://localhost:4000/api/questions/:path*",
      },
    ];
  },
};

export default nextConfig;
