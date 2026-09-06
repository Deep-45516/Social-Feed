import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required",
            });
        }

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const {
            sub: googleId,
            email,
            name,
            picture,
        } = payload;

        let user = await User.findOne({ googleId });

        if (!user) {
            user = await User.create({
                googleId,
                email,
                name,
                profilePicture: picture,
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Google login error:", error);

        return res.status(500).json({
            success: false,
            message: "Google login failed",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get user",
        });
    }
};