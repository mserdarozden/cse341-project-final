const router = require("express").Router();
const passport = require("passport");

router.use('/', require('./swagger'));

router.get("/", (req, res) => {
//#swagger.tags = ['Welcome to the Students API server']
  res.send("Welcome to the Students API server");
});

router.use("/students", require("./students"));
router.use("/courses", require("./courses"));

router.get('/login', passport.authenticate('github'), (req, res) => {
  // Optional callback after authentication is triggered
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

module.exports = router;
