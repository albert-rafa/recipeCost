import express from "express";

const PORT = 3333;
const app = express();

app.get("/ping", (_, response) => {
  response.status(200).send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
