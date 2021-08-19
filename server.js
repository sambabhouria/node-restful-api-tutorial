const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

// we need to pass a listener : specifically a fonction that will return 
// the response
const server = http.createServer(app);

// server.listen(port);

server.listen(
    { port: port },
    () =>
      console.log(
        `🚀💪🐞🥂 🐼💳💎 🛳  🦁 🍰 🏅  🤝 ⭐️  🔜 Server ready at http://localhost:${port}`
      )
);
