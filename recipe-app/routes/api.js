const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Recipe = require("../models/recipeModel");
const verifyToken = require("./middlewares/verifyToken");
const router = express.Router();
const multer = require("multer");

// POST: Signup Route
router.post("/signup", (req, res) => {
  const { name, email, password } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
          });

          return newUser.save();
        })
        .then(() =>
          res.status(201).json({ message: "User registered successfully" })
        )
        .catch((err) => {
          if (err.name === "ValidationError") {
            const errors = {};
            Object.keys(err.errors).forEach((key) => {
              errors[key] = err.errors[key].message;
            });
            return res.status(400).json({ errors });
          }
          res.status(500).json({ message: "Error saving user", error: err });
        });
    })
    .catch((err) =>
      res.status(500).json({ message: "Error finding user", error: err })
    );
});

// POST: Login Route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ message: "Invalid Password" });
        }
        // If the user is an admin, redirect them without a token
        if (user.isAdmin) {
          return res.status(403).json({
            message:
              "Admins cannot log in here. Please use the Admin Login page.",
          });
        }
        if (user.isBlocked) {
          return res.status(403).json({ message: "Your account is blocked" });
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email, isAdmin: user.isAdmin }, // Include isAdmin in token
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // Send the token and isAdmin flag to the frontend
        res.status(200).json({
          message: "Login successful",
          token,
          isAdmin: user.isAdmin, // Indicate if the user is an admin
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error during login", error: err });
    });
});

//Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "=" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1]
    );
  },
});
// File filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};
// Initialize multer
const upload = multer({ storage: storage, fileFilter: fileFilter });

// POST: Add route
router.post("/addrecipe", verifyToken, upload.single("image"), (req, res) => {
  const { title, description, ingredients, steps, cookingtime, difficulty } =
    req.body;

  // Validate input fields
  if (
    !title ||
    !description ||
    !ingredients?.length ||
    !steps?.length ||
    !cookingtime ||
    !difficulty ||
    !req.file
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Get the userId from the token
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ message: "User ID is missing" });
  }

  // Get the image path
  const imagePath = req.file.path;

  // Create a new recipe
  const newRecipe = new Recipe({
    user_id: userId,
    title,
    description,
    ingredients: JSON.parse(ingredients),
    steps: JSON.parse(steps),
    cookingtime: JSON.parse(cookingtime),
    difficulty,
    image: imagePath,
  });

  newRecipe
    .save()
    .then((savedRecipe) => {
      res.status(201).json({
        message: "Recipe added successfully",
        recipe: savedRecipe,
      });
    })
    .catch((err) => {
      console.error("Error adding recipe:", err);
      res.status(500).json({
        message: "Error adding recipe",
        error: err.message,
      });
    });
});

// Get a view and increment count
router.get("/viewrecipe/:id", verifyToken, (req, res) => {
  const recipeId = req.params.id; // Get the recipe ID from the URL parameter
  const userId = req.userId; // Get the user ID

  // Find the recipe by its ID
  Recipe.findById(recipeId)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }

      // Only increment view count if the recipe is not owned by the user
      if (recipe.user_id.toString() !== userId) {
        recipe.viewcount = recipe.viewcount + 1; // Increment view count by 1
        recipe
          .save() // Save the updated recipe document with the new view count
          .then(() => {
            res.status(200).json({
              message: "Recipe retrieved successfully",
              recipe,
            });
          })
          .catch((err) => {
            console.error("Error updating view count", err);
            res.status(500).json({
              message: "Failed to update view count",
              error: err.message,
            });
          });
      } else {
        // If the user is the owner, don't update the view count
        res.status(200).json({
          message: "Recipe retrieved successfully",
          recipe,
        });
      }
    })
    .catch((err) => {
      console.error("Error fetching recipe", err);
      res.status(500).json({
        message: "Failed to retrieve recipe",
        error: err.message,
      });
    });
});

// Edit recipe route
// Private route to fetch recipe for editing (ownership check)
router.get("/getrecipe/:id", verifyToken, (req, res) => {
  const recipeId = req.params.id;
  const userId = req.userId;

  Recipe.findOne({ _id: recipeId, user_id: userId })
    .then((recipe) => {
      if (!recipe) {
        return res
          .status(404)
          .json({ message: "Not authorized or Recipe not found" });
      }
      res.status(200).json({
        message: "Recipe retrieved successfully for editing",
        recipe,
      });
    })
    .catch((err) => {
      console.error("Error fetching recipe", err);
      res.status(500).json({ message: "Failed to retrieve recipe" });
    });
});

router.post(
  "/editrecipe/:id",
  verifyToken,
  upload.single("image"),
  (req, res) => {
    const recipeId = req.params.id.trim();
    const userId = req.userId;
    const updateData = req.body;

    // Parse steps, ingredients, and cookingtime if they exist
    if (req.body.ingredients) {
      updateData.ingredients = JSON.parse(req.body.ingredients);
    }
    if (req.body.steps) {
      updateData.steps = JSON.parse(req.body.steps);
    }
    if (req.body.cookingtime) {
      updateData.cookingtime = JSON.parse(req.body.cookingtime);
    }

    // Check if the recipe exists and if the user owns it
    Recipe.findOne({ _id: recipeId, user_id: userId })
      .then((recipe) => {
        if (!recipe) {
          return res.status(404).json({
            message: "Recipe not found or Not authorized to edit this recipe",
          });
        }

        // If a new image is uploaded, update the image path
        if (req.file) {
          updateData.image = req.file.path;
        }

        // Update the recipe with new data
        Recipe.findOneAndUpdate(
          { _id: recipeId, user_id: userId },
          updateData,
          { new: true, runValidators: true }
        )
          .then((updatedRecipe) => {
            res.status(200).json({
              message: "Recipe updated successfully",
              updatedRecipe,
            });
          })
          .catch((err) => {
            console.error("Error updating recipe:", err.message);
            if (err.name === "ValidationError") {
              return res.status(400).json({
                message: "Validation Error",
                errors: err.errors,
              });
            }
            res.status(500).json({
              message: "Internal Server Error",
              error: err.message,
            });
          });
      })
      .catch((err) => {
        console.error("Error finding recipe:", err);
        res.status(500).json({
          message: "Error finding recipe",
          error: err.message,
        });
      });
  }
);

// Delete recipe
router.delete("/deleterecipe/:id", verifyToken, (req, res) => {
  const userId = req.userId;
  const recipeId = req.params.id.trim();

  Recipe.findOneAndDelete({ _id: recipeId, user_id: userId })
    .then((deletedRecipe) => {
      if (!deletedRecipe) {
        return res
          .status(404)
          .json({ message: "Recipe not found or Not authorized" });
      }
      res
        .status(200)
        .json({ message: "Recipe deleted succesfully", deletedRecipe });
    })
    .catch((err) => {
      console.error("Error deleting recipe", err.message);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    });
});

// Dashboard and Search with Pagination
router.get("/dashboard/allrecipes", verifyToken, (req, res) => {
  console.log("Token:", req.headers.authorization);
  const searchQuery = req.query.search || "";

  // Extract pagination parameters from query
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 recipes per page
  const skip = (page - 1) * limit;

  const searchFilter = {
    $or: [
      { title: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
    ],
  };

  // Fetch required recipe fields and username
  Recipe.find(searchFilter)
    .select("title description difficulty viewcount user_id image")
    .populate("user_id", "name email")
    .skip(skip) // Skip recipes for previous pages
    .limit(limit) // Limit the number of recipes for the current page
    .then((recipes) => {
      // Map recipes into desired format
      const cardRecipes = recipes.map((recipe) => ({
        _id: recipe._id,
        title: recipe.title,
        description: recipe.description,
        difficulty: recipe.difficulty,
        viewcount: recipe.viewcount,
        image: recipe.image,
        createdBy: recipe.user_id ? recipe.user_id.name : "Unknown",
        createdByUserId: recipe.user_id
          ? recipe.user_id._id.toString()
          : "Unknown",
      }));

      // Count total recipes for pagination
      Recipe.countDocuments(searchFilter)
        .then((totalRecipes) => {
          const totalPages = Math.ceil(totalRecipes / limit);
          res.status(200).json({
            recipes: cardRecipes,
            currentPage: page,
            totalPages,
            totalRecipes,
          });
        })
        .catch((err) => {
          console.error("Error counting recipes:", err.message);
          res.status(500).json({ message: "Internal server error" });
        });
    })
    .catch((err) => {
      console.error("Error fetching recipes:", err.message);
      res.status(500).json({ message: "Internal server error" });
    });
});

// GET: Fetch User Details (userId, name, email)
router.get("/userdetails", verifyToken, (req, res) => {
  const userId = req.userId;

  User.findById(userId)
    .select("name email") // Fetch only the name and email fields
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        userId: user._id,
        username: user.name,
        userEmail: user.email,
      });
    })
    .catch((err) => {
      console.error("Error fetching user details:", err.message);
      res.status(500).json({
        message: "Internal server error",
        error: err.message,
      });
    });
});

// Profile with Pagination
router.get("/profile", verifyToken, (req, res) => {
  const userId = req.userId;
  const page = parseInt(req.query.page) || 1; // Get current page from query (default: 1)
  const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)
  const skip = (page - 1) * limit; // Calculate the number of items to skip

  // Fetch User details
  User.findById(userId)
    .select("name email")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch the user's recipes with pagination
      Recipe.find({ user_id: userId })
        .select("title description difficulty viewcount user_id image")
        .populate("user_id", "name")
        .skip(skip)
        .limit(limit)
        .then((recipes) => {
          // Fetch total count of user's recipes
          Recipe.countDocuments({ user_id: userId })
            .then((totalCount) => {
              const totalPages = Math.ceil(totalCount / limit);

              const userRecipes = recipes.map((recipe) => ({
                _id: recipe._id,
                title: recipe.title,
                description: recipe.description,
                difficulty: recipe.difficulty,
                viewcount: recipe.viewcount,
                image: recipe.image,
                createdBy: recipe.user_id ? recipe.user_id.name : "Unknown",
              }));

              res.status(200).json({
                message: "Profile fetched successfully",
                user: {
                  name: user.name,
                  email: user.email,
                },
                recipes: userRecipes,
                pagination: {
                  currentPage: page,
                  totalPages,
                  totalRecipes: totalCount,
                },
              });
            })
            .catch((err) => {
              console.error("Error fetching recipe count", err.message);
              res.status(500).json({
                message: "Internal server error",
                error: err.message,
              });
            });
        })
        .catch((err) => {
          console.error("Error fetching recipes", err.message);
          res
            .status(500)
            .json({ message: "Internal server error", error: err.message });
        });
    })
    .catch((err) => {
      console.error("Error fetching user", err.message);
      res
        .status(500)
        .json({ message: "Internal server error", error: err.message });
    });
});

//POST: Reset Password
router.post("/profile/resetpassword", verifyToken, (req, res) => {
  const userId = req.userId;
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "New password cannot be same as old password" });
  }

  //Find the user
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      //compare old passowrd with stored password
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ message: "Internal Server Error" });
        }
        if (!isMatch) {
          return res.status(400).json({ message: "Old password is incorrect" });
        }
        //Hash the new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) {
            return res.status(500).json({ message: "Internal Server Error" });
          }
          //Update the password
          user.password = hashedPassword;
          user
            .save()
            .then(() => {
              res
                .status(200)
                .json({ message: "Password updated successfully" });
            })
            .catch((err) => {
              res
                .status(500)
                .json({ message: "Error saving password", error: err.message });
            });
        });
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error finding user", error: err.message });
    });
});
module.exports = router;
