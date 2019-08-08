module.exports = {
  logs: 'production',
  corsOptions: {
    origin: (origin, callback) => {
      const whiteList = [/localhost/, /0.0.0.0/, /127.0.0.1/,/chrome-extension/,/43.231.124.147/,/43.231.124.238/];
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
