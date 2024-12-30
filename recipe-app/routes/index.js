var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const verifyAdmin = require("./middlewares/verifyAdmin");
const { trusted } = require("mongoose");

// GET home page (admin login page)
router.get("/admin-login", function (req, res) {
  res.render("admin-login", { nav: false });
});

// POST to handle login
router.post("/admin-login", function (req, res) {
  const { username, password } = req.body;

  // Find the user by email
  User.findOne({ email: username })
    .then((user) => {
      // Check if the user exists and is an admin
      if (!user || !user.isAdmin) {
        return res.render("admin-login", {
          error: "Invalid credentials or not an Admin", // Pass the error here
        });
      }

      // Compare the password with the stored hashed password
      return bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.render("admin-login", {
              error: "Invalid credentials", // Pass the error here
            });
          }

          // Store user details in session
          req.session.userId = user._id;
          req.session.isAdmin = user.isAdmin;

          console.log(`Admin logged in successfully: ${user.email}`);

          // Redirect to the admin dashboard after successful login
          return res.redirect("/admin-dashboard");
        })
        .catch((error) => {
          console.error("Error during admin login:", error.message);
          return res.render("admin-login", {
            error: "Internal server error", // Pass the error here
          });
        });
    })
    .catch((error) => {
      console.error("Error during user search:", error.message);
      return res.render("admin-login", {
        error: "Internal server error", // Pass the error here
      });
    });
});

// GET admin dashboard - fetch recent recipes
const itemsPerAdminpage = 10;
router.get("/admin-dashboard", verifyAdmin, (req, res) => {
  const adminpage = parseInt(req.query.page) || 1;
  const skipAdminpage = itemsPerAdminpage * (adminpage - 1);
  Recipe.find()
    .sort({ createdAt: -1 }) // Sort by most recent
    .skip(skipAdminpage)
    .limit(itemsPerAdminpage) // Limit to the recent 10 recipes
    .populate("user_id", "name") // Assuming recipes are associated with users
    .then((recipes) => {
      Recipe.countDocuments().then((totalRecipes) => {
        const totalPages = Math.ceil(totalRecipes / itemsPerAdminpage);
        res.render("index", {
          recipes,
          totalPages,
          currentPage: adminpage,
          nav: true,
          recipes,
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching recipes:", error.message);
      res.status(500).send("Internal Server Error");
    });
});

// GET single recipe details (view recipe)
router.get("/view-recipe/:id", verifyAdmin, (req, res) => {
  const recipeId = req.params.id;

  // Fetch the recipe with the user data populated
  Recipe.findById(recipeId)
    .populate("user_id") // Assuming `user_id` is populated with user data
    .then((recipe) => {
      res.render("veiwrecipe", { recipe: recipe });
    })
    .catch((err) => {
      console.error("Error fetching recipe:", err);
      res.status(500).send("Internal server error");
    });
});

// DELETE a recipe
router.post("/deleterecipe/:id", verifyAdmin, (req, res) => {
  Recipe.findByIdAndDelete(req.params.id)
    .then((deletedRecipe) => {
      if (!deletedRecipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.redirect("/admin-dashboard"); // Redirect to admin dashboard after deletion
    })
    .catch((error) => {
      console.error("Error deleting recipe:", error.message);
      res.status(500).send({ message: "Internal Server Error" });
    });
});
// Block User
router.post("/blockuser/:userId", verifyAdmin, (req, res) => {
  const { userId } = req.params;
  const { action } = req.body;

  const isBlocked = action === "true";
  User.findByIdAndUpdate(userId, { isBlocked: isBlocked })
    .then((user) => {
      if (!user) {
        return res.status(404).send("USer not found");
      }
      res.redirect("/userlist");
    })
    .catch((err) => {
      console.error(err);
      req.status(500).send("Error blocking/unblocking user");
    });
});

//Userlist
const itemsPerPage = 10;
router.get("/userlist", verifyAdmin, function (req, res) {
  const page = parseInt(req.query.page) || 1;
  const skip = itemsPerPage * (page - 1);
  User.find({ isAdmin: false })
    .skip(skip)
    .limit(itemsPerPage)
    .then((users) => {
      User.countDocuments().then((totalUsers) => {
        const totalPages = Math.ceil(totalUsers / itemsPerPage);

        res.render("userlist", {
          users,
          totalPages,
          currentPage: page,
          nav: true,
        });
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching users");
    });
});
router.get("/report", function (req, res) {
  Recipe.find()
    .sort({ viewcount: -1 })
    .limit(5)
    .populate("user_id", "email name")
    .then((recipes) => {
      res.render("report", { recipes, nav: true });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching most viewed recipes");
    });
});

// Route to view a user's recipes
router.get("/userrecipes/:userId", (req, res) => {
  const { userId } = req.params;

  // Fetch the user and their recipes from the database
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send("User not found");
      }

      // Fetch the recipes for the user, including the user data and viewcount
      Recipe.find({ user_id: userId })
        .populate("user_id", "name email") // Populating user data (name and email)
        .then((recipes) => {
          res.render("userrecipes", {
            recipes,
            userName: user.name, // Pass the user's name
            userEmail: user.email, // Pass the user's email
            nav: true,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Error fetching recipes");
        });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error fetching user details");
    });
});

router.post("/admin-logout", function (req, res) {
  console.log("Logging out, session before destroy:", req.session);
  req.session.destroy((err) => {
    if (err) {
      console.error("Error during logout:", err);
      return res.status(500).send("Error during logout");
    } else {
      // Redirect
      console.log("Session destroyed successfully");
      res.redirect("/admin-login");
    }
  });
});

module.exports = router;
