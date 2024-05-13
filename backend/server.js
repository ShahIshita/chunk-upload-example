const express = require("express");
const cors = require('cors');
const crypto = require('crypto');

const { Server } = require("@tus/server");
const { FileStore } = require("@tus/file-store");

const app = express();

// Allow cross origin request
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET', 'PATCH', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Upload-Offset'],
}))

const id = () => crypto.randomBytes(16).toString('hex');

const addStringToStringAtIndex = (str, index, content) => str.slice(0, index) + content + str.slice(index);

// Set up tus middleware
const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({ directory: "./files",  }),
  namingFunction: (_, metadata) => {
    // May require proper extension identification
    const extensionIndex = metadata.filename.lastIndexOf('.');
    const updatedFileName = addStringToStringAtIndex(metadata.filename, extensionIndex, '-' + id());

    return updatedFileName;
  }
});

const uploadApp = express();

uploadApp.all('*', tusServer.handle.bind(tusServer));
app.use('/files', uploadApp);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
