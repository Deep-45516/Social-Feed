import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import postRouter from "./routes/post.route.js";
import userRouter from "./routes/user.route.js";
import notificationRouter from "./routes/notification.route.js";

const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send("Social Feed Backend working 🚀");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notifications", notificationRouter);

export default app;