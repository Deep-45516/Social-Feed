import Notification from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            recipient: req.user.userId,
        })
            .populate("sender", "name profilePicture")
            .populate("post", "content")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error("Get notifications error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get notifications",
        });
    }
};