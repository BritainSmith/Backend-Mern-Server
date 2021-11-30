/** @format */

const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { createConnection } = require("mongoose");

//User crud routes

//Update user

// checking if user is equal to user id that is passed in
router.put("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		//if user updates password rehash password.
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		// try to update the user by id
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json("Account has been updated");
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only update your account");
	}
});

//Delete User

router.delete("/:id", async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		// try to update the user by id
		try {
			const user = await User.deleteOne(req.params.id);
			res.status(200).json("Account has been deleted successfully.");
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can only delete your account");
	}
});

//Get a user by id
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		//the ._doc carries the mongo document associated with the user object.
		const { password, updatedAt, ...other } = user._doc;
		// returns all other properties of the user object aside from the password, updatedAt
		res.status(200).json(other);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Follow a user
router.put("/:id/follow", async (req, res) => {
	// if the user is the same id, return error cannot follow self.
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);

			//If the user's followers don't include this user ->
			// Update both the user's followers, and the current user to following.
			// Else, return an error that states you already follow that user.
			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { following: req.body.userId } });

				res.status(200).json("User has been followed!");
			} else {
				res.status(403).json("You already follow this User!");
			}
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(403).json("you cannot follow yourself sorry!");
	}
});

//unfollow a user

router.get("/", (req, res) => {
	res.send("hey it's users route");
});

module.exports = router;
