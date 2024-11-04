const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const cohortsJson = require("./cohorts.json");
// const studentsJson = require("./students.json");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Students.model");
const Cohort = require("./models/Cohorts.model");
const User = require("./models/User.model");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling.middleware");
const PORT = 5005;
const auth = require("./routes/auth.routes");
require("dotenv").config();

const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT

console.log(Student, Cohort);
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS Setup
app.use(cors());

//Mongoose set-up
mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

// routes to auth
app.use("/auth", auth);

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

// CRUD Cohorts

// Create a new cohort
app.post("/api/cohorts", (req, res, next) => {
  Cohort.create(req.body)
    .then((createdCohort) => {
      console.log("Cohort created:", createdCohort);
      res.status(201).json(createdCohort);
    })
    .catch((error) => {
      console.error("Error creating cohort:", error);
      next(error);
    });
});

// Retrieve all cohorts
app.get("/api/cohorts", (req, res, next) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Cohorts:", cohorts);
      res.json(cohorts);
    })
    .catch((err) => {
      console.error("Error retrieving cohorts:", err);
      next(error);
    });
});

// Retrieve a specific cohort by ID
app.get("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findById(cohortId)
    .then((cohort) => {
      if (!cohort) return res.status(404).json({ error: "Cohort not found" });
      console.log("Cohort:", cohort);
      res.json(cohort);
    })
    .catch((err) => {
      console.error("Error retrieving specific cohort:", err);
      next(error);
    });
});

// Update a specific cohort by ID
app.put("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndUpdate(cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      if (!updatedCohort)
        return res.status(404).json({ error: "Cohort not found" });
      console.log("Cohort updated:", updatedCohort);
      res.status(200).json(updatedCohort);
    })
    .catch((error) => {
      console.error("Error updating cohort:", error);
      next(error);
    });
});

// Delete a specific cohort by ID
app.delete("/api/cohorts/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Cohort.findByIdAndDelete(cohortId)
    .then((deletedCohort) => {
      if (!deletedCohort)
        return res.status(404).json({ error: "Cohort not found" });
      console.log("Cohort deleted:", deletedCohort);
      res
        .status(200)
        .json({ message: `Cohort ${cohortId} deleted successfully` });
    })
    .catch((error) => {
      console.error("Error deleting cohort:", error);
      next(error);
    });
});

//CRUD Student

app.get("/api/students", (req, res, next) => {
  Student.find()
    .populate("cohort")
    .then((students) => {
      console.log("Students:", students);
      res.json(students);
    })
    .catch((err) => {
      next(error);
    });
});

app.get("/api/students/:studentsId", (req, res, next) => {
  const { studentsId } = req.params;
  Student.findById(studentsId)
    .populate("cohort")
    .then((student) => {
      console.log("Student:", student);
      res.json(student);
    })
    .catch((err) => {
      next(error);
    });
});

//CRUD: Create new student
app.post("/api/students", (req, res, next) => {
  Student.create({
    ...req.body,
  })
    .then((createdStudent) => {
      console.log("Student created :", createdStudent);
      res.status(201).json(createdStudent);
    })
    .catch((error) => {
      console.log("Error", error);
      next(error);
    });
});

//CRUD Retrieves all student for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params;
  Student.find({ cohort: cohortId })
    .populate("cohort")
    .then((students) => {
      console.log("Students retrieved", students);
      res.status(200).json(students);
    })
    .catch((error) => next(error));
});

//CRUD Update a specific student
app.put("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Student.findByIdAndUpdate(studentId, req.body, { new: true })
    .then((updatedStudent) => res.status(200).json(updatedStudent))
    .catch((error) => next(error));
});

app.delete("/api/students/:studentId", (req, res, next) => {
  const { studentId } = req.params;
  Student.findByIdAndDelete(studentId)
    .then(() => res.status(200).json("Deleted successfully" + studentId))
    .catch((error) => next(error));
});

//CRUD for User Operations
app.get("/api/users/:id", isAuthenticated, (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json(error));
});

//Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
