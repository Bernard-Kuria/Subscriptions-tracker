import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";

// someone is making a request get user details -> authorize middleware -> veryfies who is trying to do it -> if valid -> give access to the user details.

const authorize = async (req, res, next) => {
  try {
    // Find the user token of the user that is trying to make the request
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // decodes the token and verifies that, that is the user that is logged in
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // attaches it to the request
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

export default authorize;
