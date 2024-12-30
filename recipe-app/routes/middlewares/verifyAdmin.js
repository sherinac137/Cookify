function verifyAdmin(req, res, next) {
  // Check if the user is authenticated and is an admin
  if (!req.session || !req.session.userId || !req.session.isAdmin) {
    console.log("Unauthorized access attempt.");
    return res.redirect("/admin-login"); // Redirect to login if not authenticated
  }

  // User is authenticated as admin, proceed to the next middleware or route
  next();
}

module.exports = verifyAdmin;
