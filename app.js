require("dotenv").config();
const express = require("express");
const app = express();
const port = 8000;

// Parser
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// View Engine
app.set("view engine", "ejs");

// For Social Login
const passport = require("passport");
require("./controllers/userController").registrationByFacebook();
require("./helper/googlePassportLogin").okay();
// require("./controllers/userController").registrationByGoogle();

const session = require("express-session"); /*Session - when user LoggedIn */
var cookieSession = require("cookie-session");

// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDocs = require("./swagger.json");
app.use("/swagger-docs", swaggerUI.serve, swaggerUI.setup(swaggerJsDocs));

// Middleware FOR SOCAIL LOGIN
// app.use(
//   session({
//     resave: false,
//     saveUninitialized: true.valueOf,
//     secret: process.env.SESSION_SECRET,
//   })
// );

app.use(
  session({
    maxAge: 24 * 60 * 60 * 1000, // 24 hours

    secret: ["AnkushThakur"],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Body Parser & Cookier Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// My Routes
const userRoutes = require("./routes/userRoutes");

// DataBase Connection
require("./dbConnection").connectDB();

// Model Connection
require("./models/index");

// Routes Middleware
app.use("/api", userRoutes);

// LISTENING
app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});
