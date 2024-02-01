const cors = require("cors");
const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const pino = require("pino-http");
const mainRouter = require("./routes/routes");
const mongoose = require("mongoose");
const {
	otherError,
	validationError,
	appError,
} = require("./handlers/error.handler");
const path = require("path");

// app bootstrap
const app = express();

// set up json logger
app.use(pino());

// set cors option for remote access
app.use(cors({ origin: ["*"] }));

// adding json body parser to app
app.use(bodyParser.json());

//mongoose connection
mongoose.connect(process.env.DB_URL);

app.use(express.static(path.join(__dirname, "public", "browser")));

// api main entry point
app.use("/api", mainRouter);

// serving app
app.get("*", function (req, res) {
	res.sendFile(path.join(__dirname, "public", "browser", "index.html"));
});

// error handling middlewares
app.use(validationError);
app.use(appError);
app.use(otherError);

// use port from env or use 8000 if not set
const PORT = process.env.port ?? 8000;
app.listen(PORT, () => {
	console.log(`App up and running at http://localhost:${PORT}`);
});
