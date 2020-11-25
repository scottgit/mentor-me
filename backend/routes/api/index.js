const router = require("express").Router();
const sessionRouter = require("./session.js");
const usersRouter = require("./users.js");
const discussionsRouter = require("./discussions.js")

router.use("/session", sessionRouter);

router.use("/users", usersRouter);

router.use("/discussions", discussionsRouter);

module.exports = router;
