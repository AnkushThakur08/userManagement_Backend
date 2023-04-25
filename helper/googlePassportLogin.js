// Services
const Service = require("../Services");

require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

module.exports = {
  okay: async (req, res) => {
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(async function (id, done) {
      console.log("Line 217", id);
      const data = await Service.userService.getUserBygoogleId(id);
      console.log("Line no 219", data);
      if (data) {
        (err, user) => {
          done(err, user);
        };
      }
      l;
    });

    // passport.deserializeUser(function (id, done) {
    //   return done(null, id);
    // });

    // Google Startegy
    passport.use(
      new GoogleStrategy(
        {
          // This will ask the token From Google
          clientID: process.env.GOOGLE_CLIENTID,
          clientSecret: process.env.GOOGLE_CLIENTSECRET,
          callbackURL:
            "http://localhost:8000/api/google/callback" /* In this url google will attach the token and based on that token we will ask information  */,
          // profileFields: ["id", "displayName", "email"],
        },
        async (token, refreshToken, profile, next) => {
          // Based on the token which google provided, we will ask Information
          console.log("PROFILE", profile);
          console.log("TOKEN", token);

          const userData = {
            email: profile._json.email,
          };

          if (userData.email) {
            const user = await Service.userService.findUserByEmail(userData);

            if (user) {
              console.log("User alread exists in Database", user);

              next(null, user);

              // Put Token in the cookies
              // res.cookie("token", token, { expire: new Date() + 9999 });

              return {
                status: 400,
                message: "User already exists in Database",
                data: user,
                json: user,
              };
            } else {
              let userData = {
                name: profile.displayName,
                googleId: profile.id,
                email: profile._json.email,
                authenticationMethod: 4,
                resetToken: token,
                // user: req.user,
              };

              console.log(userData);

              const user = await Service.userService.registration(userData);
              next(null, user);

              // Cookie Token
              // Put Token in the cookies
              // res.cookie("token", token, { expire: new Date() + 9999 });

              return {
                status: 200,
                message: "User registration successfully",
              };
            }
          }

          // return done(null, profile);
        }
      )
    );
  },
};
