import express from "express";

import recipeRouter from "./routes/recipeRoutes";

const PORT = 3333;
const app = express();

app.use(express.json());
app.use("/recipe", recipeRouter);

app.get("/ping", (_, response) => {
  response.status(200).send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
