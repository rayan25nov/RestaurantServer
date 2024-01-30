import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
// Initializing app
const app = express();

// Importing the Database Connection
import dbConnect from "./db/Config.js";
dbConnect();

// Define routes
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";

// Print hello world
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/orders", orderRoutes);
app.use("/cart", cartRoutes);
app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/tables", tableRoutes);

// listening the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
