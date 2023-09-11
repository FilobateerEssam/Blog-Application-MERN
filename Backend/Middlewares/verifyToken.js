const express = require("express");
const { func } = require("joi");
const jwt = require("jsonwebtoken");

// verify token

function verifyToken(req, res, next) {

    // get token from header
  const authToken = req.headers.authorization;

  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      // used to decode token which have 2 parts header and payload (id and isAdmin)
      // verify token by token & secret key

      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET);
      // add user to req object which contain id and isAdmin
      req.user = decodedPayload;
      next();
    } catch (error) {
        // 401 Unauthorized
      return res.status(401).json({ message: "invalid token , access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided , access denied" });
  }
}

// verify admin

function verifyTokenAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      // 403 Forbidden
      return res
        .status(403)
        .json({ message: `Not Allowed ⚠☢ , you are not Admin` });
    }
  });
}


// verify token & Only user Himself

function verifyTokenOnlyuser(req, res, next) {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id) {
        next();
      } else {
        // 403 Forbidden
        return res
          .status(403)
          .json({ message: `Not Allowed ⚠☢ , Only user Himself` });
      }
    });
}

// Verify Token Admin &  user Himself
function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {

      // if user is admin or user himself can access

      if (req.user.isAdmin || req.user.id === req.params.id) {
        next();
      } else {
        // 403 Forbidden
        return res
          .status(403)
          .json({ message: `Not Allowed ⚠☢ , Only user Himself or Admin` });
      }
    });
}




module.exports = { 
    verifyToken, 
    verifyTokenAdmin,
    verifyTokenOnlyuser,
    verifyTokenAndAuthorization,
 }
