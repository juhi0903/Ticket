module.exports = {
  logs: 'dev',
  corsOptions: {
    origin: (origin, callback) => {
      // In dev, allow these IPs to access the API
      const whiteList = [/localhost/, /0.0.0.0/, /127.0.0.1/,/chrome-extension/, /43.231.124.238/];
      // We are doing string matching here.
      // For advanced use-case, use regex
      const index = whiteList.findIndex((anIP) => anIP.test(origin));
      if (!origin || index !== -1) {
        callback(null, true);
      } else {
        callback(new Error(`ORIGIN: '${origin}' Not allowed by CORS`));
      }
    },
    credentials: false,
  }
};
