// require your server and launch it here
const server = require("./api/server");

const PORT = process.env.PORT;

// START SERVER HERE

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
