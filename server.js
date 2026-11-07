require("dotenv").config();

const pool = require("./config/db");
const app = require("./app");

const PORT = Number(process.env.PORT) || 4000;

async function startServer() {
    try {
        await pool.query("SELECT 1");

        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
}

startServer();
