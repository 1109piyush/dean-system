require("dotenv").config();
const ConnectToDB = require("./db");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to your MongoDB using mongoose.connect()
ConnectToDB();

// Define Mongoose models 
const Student = require("./models/Student");
const Dean = require("./models/Dean");
const Session = require("./models/Session");

// JWT secret key
const JWT_SECRET = "piyush";

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  });
}

// Route for testing
app.get("/", (_, res) => {
  res.json({ message: "Hello World" });
});

// Route for registering students and deans
app.post("/register", async (req, res) => {
  const { universityId, password, role } = req.body;

  if (!universityId || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role.toLowerCase() === "student") {
      const student = new Student({ universityId, password: hashedPassword });
      await student.save();
      res.status(201).json({ message: "Student registered successfully" });
    } else if (role.toLowerCase() === "dean") {
      const dean = new Dean({ universityId, password: hashedPassword });
      await dean.save();
      res.status(201).json({ message: "Dean registered successfully" });
    } else {
      res.status(400).json({ message: "Invalid role" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route for logging in students and deans
app.post("/login", async (req, res) => {
  const { universityId, password, role } = req.body;

  if (!universityId || !password || !role) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let user;

    if (role.toLowerCase() === "student") {
      user = await Student.findOne({ universityId }).exec();
    } else if (role.toLowerCase() === "dean") {
      user = await Dean.findOne({ universityId }).exec();
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid university ID or role" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* Route for students to see free sessions (authenticated)

// Route for students to see free sessions
app.get("/sessions/free", authenticateToken, async (req, res) => {
  const { authorization } = req.headers;
  try {
    const student = await Student.findById(authorization).exec();

    if (student) {
      const deans = await Dean.find().exec();
      const deansIds = deans.map((dean) => dean._id);
      const sessions = await Session.find({
        deanId: { $nin: deansIds },
        endTime: { $gt: new Date() },
      }).exec();
      res.json(sessions);
    } else {
      res.json({ message: "Invalid token" });
    }
  } catch (error) {
    res.json({ message: error.message });
  }
});


// Route for students to book a session
app.post("/sessions/book",authenticateToken, async (req, res) => {
  const { authorization } = req.headers;
  const { deanId, startTime, endTime } = req.body;
  try {
    const session = new Session({ startTime, endTime, studentId: authorization, deanId });
    await session.save();
    res.json(session);
  } catch (error) {
    res.json({ message: error.message });
  }
});

// Route for deans to see pending sessions
app.get("/sessions/pending",authenticateToken, async (req, res) => {
  const { authorization } = req.headers;
  try {
    const sessions = await Session.find({
      deanId: authorization,
      endTime: { $gt: new Date() },
    }).exec();
    res.json(sessions);
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = app;
*/
