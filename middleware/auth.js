const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  const tokenFound = authHeader.split(" ")[1];

  if (!tokenFound || tokenFound === " ") {
    req.isAuth = false;
    return next();
  }

  let verifiedToken;
  try {
    verifiedToken = jwt.verify(tokenFound, "mySecretIsSecretive");
  } catch (err) {
    console.log("catch", err);
  }

  //   jwt.verify(tokenFound, "mySecretIsSecretive", (err, decoded) => {
  //     if (err) {
  //       console.error("JsonWebTokenError: invalid signature", err);
  //       req.isAuth = false;
  //       return next();
  //     } else {
  //       console.log("Token decoded successfully", decoded);
  //       req.isAuth = true;
  //       req.userId = decoded.userId;
  //       next();
  //     }
  //   });

  if (!verifiedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = verifiedToken.userId;
  next();
};
