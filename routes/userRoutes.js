const express = require("express");
const router = express.Router();

// Social Login
const passport = require("passport");

// Validation
const { check, body, validationResult } = require("express-validator");

const userController = require("../controllers/userController");
const sendRespose = require("../helper/sendResponse");

// const { isLoggedIn } = require("../middleware/socialAuthMiddleware");

const isAuth = require("../middleware/authticationMiddlwares");
const { Router } = require("express");

//TODO: REGISTERATION & LOGIN
router.post(
  "/registration",
  [
    check("name")
      .isLength({ min: 4 })
      .trim()
      .custom((value) => {
        return value.match(/^[A-Za-z ]+$/);
      })
      .withMessage("Name must have 3 Alphabet Characters"),

    check("email").isEmail().optional(),

    check("password")
      .isLength({ min: 4 })
      .withMessage("Password should be atleast of 4 Characters"),

    check("phoneNumber").isMobilePhone().optional(),
  ],

  (req, res) => {
    // console.log(req);
    return sendRespose.executeMethod(
      userController.registration,
      req.body,
      req,
      res
    );
  }
);

router.post("/registrationSendOTP", (req, res) => {
  return sendRespose.executeMethod(
    userController.registrationSendOTP,
    req.body,
    req,
    res
  );
});

router.post("/SendOTP", (req, res) => {
  return sendRespose.executeMethod(userController.SendOTP, req.body, req, res);
});

router.post("/verifyOTP", (req, res) => {
  return sendRespose.executeMethod(
    userController.verifyOTP,
    req.body,
    req,
    res
  );
});

router.post("/verifyOTPLogin", (req, res) => {
  return sendRespose.executeMethod(
    userController.verifyOTPLogin,
    req.body,
    req,
    res
  );
});

router.put(
  "/updateUser",
  isAuth,
  [
    check("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Gender Must be Male/Female/Others"),

    check("age").isNumeric().withMessage("Age Must be between 0-100"),
    check("address")
      .isLength({ min: 4 })
      .trim()
      .custom((value) => {
        return value.match(/^[A-Za-z ]+$/);
      })
      .withMessage("Address must have 3 Characters"),
  ],
  (req, res) => {
    return sendRespose.executeMethod(
      userController.updateUser,
      req.body,
      req,
      res
    );
  }
);

router.post("/login", (req, res) => {
  return sendRespose.executeMethod(userController.login, req.body, req, res);
});

//TODO: DASHBOARD

router.get("/countAllUser", (req, res) => {
  return sendRespose.executeMethod(
    userController.countAllUser,
    req.body,
    req,
    res
  );
});

router.get("/countuserByPhoneNumber", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByPhoneNumber,
    req.body,
    req,
    res
  );
});

router.get("/countuserByEmail", (req, res) => {
  return sendRespose.executeMethod(
    userController.countuserByEmail,
    req.body,
    req,
    res
  );
});

router.get("/getUserBygoogleId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserBygoogleId,
    req.body,
    req,
    res
  );
});

router.get("/getUserByFacebookId", (req, res) => {
  return sendRespose.executeMethod(
    userController.getUserByFacebookId,
    req.body,
    req,
    res
  );
});

// Password RESET
router.post("/sendResetPasswordMail", (req, res) => {
  return sendRespose.executeMethod(
    userController.sendResetPasswordMail,
    req.body,
    req,
    res
  );
});

router.post("/changePassword", (req, res) => {
  return sendRespose.executeMethod(
    userController.changePassword,
    req.body,
    req,
    res
  );
});

router.post("/changePhonePassword", (req, res) => {
  return sendRespose.executeMethod(
    userController.changePhonePassword,
    req.body,
    req,
    res
  );
});

// INVITE FRIEND
router.post(
  "/SendInviteFriendMail",
  [
    check("name")
      .isLength({ min: 4 })
      .trim()
      .custom((value) => {
        return value.match(/^[A-Za-z ]+$/);
      })
      .withMessage("Name must have 3 Alphabet Characters"),

    check("email").isEmail(),
  ],
  (req, res) => {
    return sendRespose.executeMethod(
      userController.SendInviteFriendMail,
      req.body,
      req,
      res
    );
  }
);

router.post("/AcceptInvite", (req, res) => {
  return sendRespose.executeMethod(
    userController.AcceptInvite,
    req.body,
    req,
    res
  );
});

router.post("/RejectInvite", (req, res) => {
  return sendRespose.executeMethod(
    userController.RejectInvite,
    req.body,
    req,
    res
  );
});

router.get("/allInvities", (req, res) => {
  return sendRespose.executeMethod(
    userController.allInvities,
    req.body,
    req,
    res
  );
});

// FOR SOCIAL LOGIN - Facebook
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"],
  }),
  (req, res) => {
    res.send("Hello Facebook");
  }
);

// FaceBook CallBack
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/home",
  }),
  (req, res) => {
    return sendRespose.executeMethod(
      userController.registrationByFacebook,
      req.body,
      req,
      res
    );
  }
);

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect("/api/login");
  }
  next();
};

router.get("/", isLoggedIn, (req, res) => {
  res.render("home");
});

router.get("/login", (req, res) => {
  res.render("login");
});

// FOR SOCIAL LOGIN - Google

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (req, res) => {
    res.send("Hello Google!!");
  }
);

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "http://localhost:3000/",
//     failureRedirect: "http://localhost:3000/home",
//   }),

//   (req, res) => {
//     return sendRespose.executeMethod(
//       userController.registrationByGoogle,
//       req.body,
//       req,
//       res
//     );
//   }
// );

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/home",
  }),

  (req, res) => {
    res.send(req.user);
  }
);

router.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.send("User logged out successfully!!");
  });
});

// LOGOUT
exports.signout1 = (req, res) => {
  res.clearCookie("token"); // Clear the cookier whose name is Token
  res.json({
    user: "User Signout Successfully",
  });
};

// NOTIFICATION
router.post("/addNotification", (req, res) => {
  return sendRespose.executeMethod(
    userController.addNotification,
    req.body,
    req,
    res
  );
});

router.get("/getNotification", (req, res) => {
  return sendRespose.executeMethod(
    userController.getNotification,
    req.body,
    req,
    res
  );
});

// FIXME: COUNT
router.get("/getAllUser", (req, res) => {
  return sendRespose.executeMethod(
    userController.getAllUser,
    req.body,
    req,
    res
  );
});
module.exports = router;

// s:PSmhHqw5EIacf-9cXAaTu5xz5wj457wl.UAcvaEYq2/p7TnGsuw8FPU0wCPU71FZcrDRS4MMwMoQ

// ojplmecpdpgccookcobabopnaifgidhf
