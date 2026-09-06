import { useEffect, useState } from "react";
import axios from "axios";
import GoogleLoginButton from "./components/GoogleLoginButton";
import "./App.css";

const API = "https://social-feed-backend.onrender.com/api/v1";

function App() {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [commentText, setCommentText] = useState({});

    const [profile, setProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`,
    };

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`${API}/posts`);
            setPosts(response.data.posts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
    };

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API}/users/me`, {
                headers,
            });

            setProfile(response.data.user);
        } catch (error) {
            console.error("Failed to fetch profile:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API}/notifications`, {
                headers,
            });

            setNotifications(response.data.notifications);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchPosts();

        if (token) {
            fetchProfile();
            fetchNotifications();
        }
    }, [token]);

    const handlePost = async () => {
        if (!content.trim() || !token) return;

        try {
            await axios.post(
                `${API}/posts`,
                { content },
                { headers }
            );

            setContent("");
            fetchPosts();
        } catch (error) {
            console.error("Failed to create post:", error);
        }
    };

    const handleLike = async (postId) => {
        try {
            await axios.post(
                `${API}/posts/${postId}/like`,
                {},
                { headers }
            );

            fetchPosts();
        } catch (error) {
            console.error("Failed to like post:", error);
        }
    };

    const handleComment = async (postId) => {
        const text = commentText[postId];

        if (!text?.trim()) return;

        try {
            await axios.post(
                `${API}/posts/${postId}/comments`,
                { text },
                { headers }
            );

            setCommentText({
                ...commentText,
                [postId]: "",
            });

            fetchPosts();
        } catch (error) {
            console.error("Failed to comment:", error);
        }
    };

    return (
        <div className="app">

            {/* Navbar */}
            <header className="navbar">
                <h1>Social Feed</h1>

                <div className="nav-actions">

                    {!token && <GoogleLoginButton />}

                    {token && (
                        <>
                            <button
                                className="icon-button"
                                onClick={() => {
                                    setShowNotifications(
                                        !showNotifications
                                    );
                                    fetchNotifications();
                                }}
                            >
                                🔔

                                {notifications.length > 0 && (
                                    <span className="notification-count">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            <button
                                className="profile-button"
                                onClick={() => {
                                    setShowProfile(!showProfile);
                                    fetchProfile();
                                }}
                            >
                                {profile?.profilePicture ? (
                                    <img
                                        src={profile.profilePicture}
                                        alt="profile"
                                    />
                                ) : (
                                    profile?.name?.charAt(0)
                                )}
                            </button>
                        </>
                    )}

                </div>
            </header>

            {/* Notifications */}
            {showNotifications && token && (
                <div className="notification-panel">

                    <h3>Notifications</h3>

                    {notifications.length === 0 ? (
                        <p>No notifications yet.</p>
                    ) : (
                        notifications.map((notification) => (
                            <div
                                className="notification"
                                key={notification._id}
                            >
                                <strong>
                                    {notification.sender?.name}
                                </strong>{" "}
                                {notification.message}

                                <small>
                                    {new Date(
                                        notification.createdAt
                                    ).toLocaleString()}
                                </small>
                            </div>
                        ))
                    )}

                </div>
            )}

            <main className="container">

                {/* Profile */}
                {showProfile && token && profile && (
                    <section className="profile-card">

                        <div className="profile-avatar">
                            {profile.profilePicture ? (
                                <img
                                    src={profile.profilePicture}
                                    alt="profile"
                                />
                            ) : (
                                profile.name?.charAt(0)
                            )}
                        </div>

                        <h2>{profile.name}</h2>

                        <p>{profile.email}</p>

                        <p className="bio">
                            {profile.bio || "No bio yet."}
                        </p>

                    </section>
                )}

                {/* Create Post */}
                {token && (
                    <section className="create-section">

                        <h2>Create a post</h2>

                        <textarea
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                        />

                        <button
                            className="post-button"
                            onClick={handlePost}
                        >
                            Create Post
                        </button>

                    </section>
                )}

                {/* Feed */}
                <section className="feed-section">

                    <h2>Public Feed</h2>

                    {posts.length === 0 && (
                        <p className="empty">
                            No posts yet.
                        </p>
                    )}

                    {posts.map((post) => (
                        <article
                            className="post-card"
                            key={post._id}
                        >

                            <div className="post-header">

                                <div className="avatar">
                                    {post.user?.name?.charAt(0)}
                                </div>

                                <div>
                                    <strong>
                                        {post.user?.name}
                                    </strong>

                                    <small>
                                        {new Date(
                                            post.createdAt
                                        ).toLocaleString()}
                                    </small>
                                </div>

                            </div>

                            <p className="post-content">
                                {post.content}
                            </p>

                            <div className="post-actions">

                                <button
                                    onClick={() =>
                                        handleLike(post._id)
                                    }
                                >
                                    ❤️ {post.likes?.length || 0}
                                </button>

                                <span>
                                    💬{" "}
                                    {post.comments?.length || 0}
                                </span>

                            </div>

                            {/* Comments */}
                            {post.comments?.map((comment) => (
                                <div
                                    className="comment"
                                    key={comment._id}
                                >
                                    <strong>
                                        {comment.user?.name}
                                    </strong>{" "}
                                    {comment.text}
                                </div>
                            ))}

                            {token && (
                                <div className="comment-box">

                                    <input
                                        placeholder="Write a comment..."
                                        value={
                                            commentText[post._id] ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            setCommentText({
                                                ...commentText,
                                                [post._id]:
                                                    e.target.value,
                                            })
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            handleComment(post._id)
                                        }
                                    >
                                        Send
                                    </button>

                                </div>
                            )}

                        </article>
                    ))}

                </section>

            </main>
        </div>
    );
}

export default App;