const express = require("express");
const app = express();

const authRouter = require("./routes/authRoutes");
const movieRouter = require("./routes/movies");
const adminRouter = require("./routes/adminRoutes")

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Movie API is running"
    });
});

app.use("/api/auth", authRouter);
app.use("/api/movies", movieRouter);
app.use("/api/admin", adminRouter);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack || err);

    if (res.headersSent) {
        return next(err);
    }

    if (err.type === "entity.parse.failed") {
        return res.status(400).json({
            success: false,
            message: "Invalid JSON in request body"
        });
    }

    if (
    Number.isInteger(err.statusCode) &&
    err.statusCode >= 400 &&
    err.statusCode < 500
) {
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}

    return res.status(500).json({
        success: false,
        message: "Something went wrong on the server!"
    });
});

module.exports = app;