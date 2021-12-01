/** @format */
const Post = require("../models/Post");
const User = require("../models/User");

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

//Like / dislike a Post

router.put("/:id/like", async (req, res) => {
	try {
		// Find the post
		const post = await Post.findById(req.params.id);
		// When post is found, check if it's liked by the user and push the userId to the likes array.
		if (!post.likes.includes(req.body.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json("The post has been liked!");
		} else {
			//else if the post is disliked, pull the user from the likes array.
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json("The post has been disliked.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get a Post
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//Get timeline Posts (Get all posts in user's following array)
router.get("/timeline/all", async (req, res) => {
	try {
		// find the current user
		const currentUser = await User.findById(req.body.userId);
		// find the current users posts
		const userPosts = await Post.find({ userId: currentUser._id });
		// find their friends posts by matching user ids that are the user's friends (friendId)
		//by accessing the following array.
		// Then map over the following away to determine your friends posts, and bind them with the user's posts
		const friendPosts = await Promise.all(
			currentUser.following.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.status(200).json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
