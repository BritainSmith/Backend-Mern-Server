/** @format */
const Post = require("../models/Post");

const router = require("express").Router();

//Create a Post
router.post("/", async (req, res) => {
	const newPost = new Post(req.body);

	try {
		const savePost = await newPost.save();
		res.status(200).json(savePost);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Update a Post

router.put("/:id", async (req, res) => {
	try {
		// will check for a post associated with a user id.
		const post = await Post.findById(req.params.id);
		//if the posts user id is the same as the user id that is passed in,
		// it will update the post. Else it will deny access.
		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json("Your post has been updated!");
		} else {
			res.status(403).json("You can only update your own posts!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//Delete a Post

router.delete("/:id", async (req, res) => {
	try {
		// will check for a post associated with a user id.
		const post = await Post.findById(req.params.id);
		//if the posts user id is the same as the user id that is passed in,
		// it will delete the post. Else it will deny access.
		if (post.userId === req.body.userId) {
			await post.deleteOne({ $set: req.body });
			res.status(200).json("Your post has been deleted!");
		} else {
			res.status(403).json("You can only delete your own posts!");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//Like a Post
//Get a Post
//Get timeline Posts (Get all posts in user's following array)

module.exports = router;
