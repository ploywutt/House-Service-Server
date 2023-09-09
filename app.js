import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerfile from "./swagger-docs/swagger.json" assert { type: "json" };

import categoriesRouter from "./routes/v1/admin/categories.js";
import servicesRouter from "./routes/v1/admin/services.js"
import loginAdmin from "./routes/v1/admin/login.js"

import v1UserProductRouter from "./routes/v1/user/products.js";
import registerRouter from "./routes/v1/user/register.js"

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerfile));

app.use("/v1/admin/categories", categoriesRouter);
app.use("/v1/admin/services", servicesRouter)
app.use("/v1/admin/login", loginAdmin)

app.use("/v1/user/products", v1UserProductRouter);
app.use("/register", registerRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
