const express = require("express");
const { Server } = require("@tus/server");
const { FileStore } = require("@tus/file-store");

const app = express();

// Set up tus middleware
const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({ directory: "./files" }),
});

app.all("/files", (req, res) => {
    tusServer.handle(req, res);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
