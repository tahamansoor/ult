# UTL (UDP Like TCP) — Proof of Concept

> **This is a Proof of Concept.**  
> It is not production-ready and is meant solely to demonstrate core ideas of building a reliable messaging system on top of UDP.

---

## What is UTL?

**UTL (UDP Like TCP)** is an experimental protocol that brings TCP-like reliability to UDP-based communication.

The goal is to simulate:
- Ordered delivery  
- Complete message reconstruction  
- Lightweight, connectionless transmission  

All built using raw **UDP sockets** in Node.js.

---

## What This PoC Demonstrates

- Breaking a JSON payload into chunks  
- Sending each chunk over UDP with metadata:
  - chunk content  
  - index  
  - total chunk count  
-  Reassembling the original message on the server  
-  Measuring per-chunk arrival delay  

---

## How to Run

### Prerequisites
- Node.js (v14+ recommended)

### 1. Start the Server

```bash
node server.js
```
##### This will bind a UDP server on port 41234 and log incoming chunks with timing details.

### 2. Start the Client
```bash
node client.js
```

##### The client creates a JSON payload, splits it into characters, and sends them one-by-one to the server.


### Packet Structure

Each UDP message contains an array in string form:

```js
[chunk, index, totalLength]
```


### Next Steps (Ideas for Future)

- Resend logic for missing chunks

- ACK system (server ↔ client communication)

- Chunk grouping (send multiple characters per packet)

- Message IDs (support multiple messages simultaneously)

- Binary protocol support (more efficient than JSON)


### Why Do This?

UDP is fast but unreliable. TCP is reliable but heavy.

UTL explores the space in between AND that gives us:

- The speed of UDP

- The control to define your own reliability model
