import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerfile from "./swagger-docs/swagger.json" assert { type: "json" };

import v1AdminProductRouter from "./routes/v1/admin/products.js";

import v1UserProductRouter from "./routes/v1/user/products.js";
import registerRouter from "./routes/v1/user/register.js"

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerfile));

app.use("/v1/admin/products", v1AdminProductRouter);

app.use("/v1/user/products", v1UserProductRouter);

app.use("/register", registerRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
