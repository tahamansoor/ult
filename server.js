const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const message = [];
let chunkReceived = 0;
let initialMessageTime = 0;
let lastChunkIndex = -1;
const missingChunksIndices = [];
let lastMessageTime = 0;
let totalDelay = 0;
server.on("message", (msg, rinfo) => {
  chunkReceived++;
  const currentTime = Date.now();
  if (message.length === 0) {
    initialMessageTime = currentTime;
    lastMessageTime = currentTime;
  } else {
    const timeDifference = currentTime - lastMessageTime;
    totalDelay += timeDifference;
    lastMessageTime = currentTime;
  }
  const [event, data] = msg.toString().split(":");
  const [chunk, index, length] = data.split("|");

  const indexNumber = Number(index);

  if (event == "notification") {
    const expectedIndex = lastChunkIndex + 1;
    if (indexNumber > expectedIndex) {
      missingChunksIndices.push(expectedIndex);
    }

    if (missingChunksIndices.includes(indexNumber)) {
      missingChunksIndices.splice(missingChunksIndices.indexOf(index), 1);
    }

    message[index] = chunk;
    console.log(`${message.length} chunk`);
    console.log(`Message received from ${rinfo.address}:${rinfo.port}`);

    if (chunkReceived === Number(length)) {
      const averageDelay = totalDelay / chunkReceived;
      console.log(message.join("").toString());
      console.log(`Total delay: ${totalDelay} ms`);
      console.log(`Average delay: ${averageDelay} ms`);
    }

    if (missingChunksIndices.length > 0) {
      console.log("Missing chunks:", missingChunksIndices);
      setTimeout(() => {
        missingChunksIndices.forEach((index) => {
          const chunk = Buffer.from(`retry:${index}`);
          server.send(chunk, rinfo.port, rinfo.address);
        });
      }, 1000); // only retrying if chunks do not arrive in some time;
    }
  }
});

server.bind(41234, () => {
  console.log("Server listening on port 41234");
});
