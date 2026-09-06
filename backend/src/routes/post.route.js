import { Router } from "express";

import {
    createPost,
    getAllPosts,
    likePost,
    addComment,
} from "../controllers/post.controller.js";

import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

// Create post
router.post("/", verifyToken, createPost);

// Public feed
router.get("/", getAllPosts);

// Like / Unlike
router.post("/:id/like", verifyToken, likePost);

// Comment
router.post("/:id/comments", verifyToken, addComment);

export default router;