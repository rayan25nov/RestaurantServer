import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

// Initializing app
const app = express();

// Importing the Database Connection
import dbConnect from "./db/Config.js";
dbConnect();

// Importing the Cloudinary Connection
import cloudinaryConnect from "./db/Cloudinary.js";
cloudinaryConnect();

// Define routes
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// routes
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/tables", tableRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/staffs", staffRoutes);
// Check token
import { checkTokenExpiration } from "./middlewares/adminMiddleware.js";
app.use("/checkTokenExpiration", checkTokenExpiration);

// listening the server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
