import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { Server } from "socket.io";
import http from "http"; // Import the http module

// Initializing app
const app = express();
const server = http.createServer(app); // Create an HTTP server
const admin = process.env.ADMIN;
const client = process.env.CLIENT;
const io = new Server(server, {
  cors: {
    origin: [admin, client], // Allow both client and admin origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Handling socket.io connections
io.on("connection", (socket) => {
  console.log("A user connected with id : ", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Export io to use in other files
export { io };

// Importing the Database Connection
import dbConnect from "./db/Config.js";
dbConnect();

// Importing the Cloudinary Connection
import cloudinaryConnect from "./db/Cloudinary.js";
cloudinaryConnect();

// Define routes
import orderRoutes from "./routes/orderRoutes.js";
import oldOrderRoutes from "./routes/oldOrderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

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

// Routes
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/old-orders", oldOrderRoutes);
app.use("/staffs", staffRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);
app.use("/feedbacks", feedbackRoutes);

// Check token
import { checkTokenExpiration } from "./middlewares/adminMiddleware.js";
app.use("/checkTokenExpiration", checkTokenExpiration);

// Listening to the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
