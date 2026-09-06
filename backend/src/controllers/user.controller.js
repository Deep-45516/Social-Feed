import User from "../models/user.model.js";

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select(
            "-googleId"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Get profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get profile",
        });
    }
};


export const updateProfile = async (req, res) => {
    try {
        const { name, bio, profilePicture } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name,
                bio,
                profilePicture,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-googleId");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    } catch (error) {
        console.error("Update profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};