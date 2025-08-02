const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const obj = {
  name: "John",
  age: 30,
  city: "New York",
};
const array = JSON.stringify(obj).split("");
client.bind(() => {
  const address = client.address();
  console.log(`Client started on ${address.address}:${address.port}`);

  array.forEach((chunk, index) => {
    const data = Buffer.from(`notification:${chunk}|${index}|${array.length}`);
    console.log(data, "data");
    client.send(data, 41234, "localhost");
  });
});

client.on("message", (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}`);

  const [event, index] = msg.toString().split(":");

  if (event === "retry") {
    const data = Buffer.from(
      `notification:${array[index]}|${index}|${array.length}`,
    );
    console.log(data, "data");
    client.send(data, 41234, "localhost");
  }
});
