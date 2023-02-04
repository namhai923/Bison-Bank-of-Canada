import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

let app = express();

app.use(cors());
app.use(express.urlencoded({ extended: "true" }));
app.use(express.json());

app.use(routes);

export default app;
