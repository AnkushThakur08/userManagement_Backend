const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
