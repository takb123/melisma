const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const userRouter = require("./routes/userRouter");
const musicRouter = require("./routes/musicRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// middleware
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// healthcheck path
app.get("/", (req, res) => {
    res.send("ok");
});

// route
app.use("/api/user", userRouter);
app.use("/api/music", musicRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});