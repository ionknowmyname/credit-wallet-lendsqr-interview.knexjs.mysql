import express from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();
const app = express();
app.use(express.json());
app.use(routes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
