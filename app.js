import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import productRouter from "./routes/products.js";
import swaggerfile from "./swagger-docs/swagger.json" assert { type: "json" };

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerfile));
app.use("/products", productRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
