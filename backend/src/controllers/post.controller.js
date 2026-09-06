import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({
                success: false,
                message: "Post content is required",
            });
        }

        const post = await Post.create({
            user: req.user.userId,
            content,
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Create post error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create post",
        });
    }
};


export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate("user", "name profilePicture")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (error) {
        console.error("Get posts error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get posts",
        });
    }
};


export const likePost = async (req, res) => {
    try {
        const { id } = req.params;

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        const userId = req.user.userId;

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes = post.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
        } else {
            post.likes.push(userId);
        }

        await post.save();

if (!alreadyLiked && post.user.toString() !== userId.toString()) {
    await Notification.create({
        recipient: post.user,
        sender: userId,
        post: post._id,
        type: "like",
        message: "liked your post",
    });
}

        return res.status(200).json({
            success: true,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (error) {
        console.error("Like post error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to like post",
        });
    }
};


export const addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({
                success: false,
                message: "Comment is required",
            });
        }

        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }

        post.comments.push({
            user: req.user.userId,
            text,
        });

        await post.save();
        if (post.user.toString() !== req.user.userId.toString()) {
    await Notification.create({
        recipient: post.user,
        sender: req.user.userId,
        post: post._id,
        type: "comment",
        message: "commented on your post",
    });
}

        return res.status(201).json({
            success: true,
            message: "Comment added successfully",
        });
    } catch (error) {
        console.error("Comment error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add comment",
        });
    }
};