import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const API = "https://social-feed-dn0q.onrender.com/api/v1";

const GoogleLoginButton = () => {
    const handleSuccess = async (response) => {
        try {
            const result = await axios.post(
                `${API}/auth/google`,
                {
                    credential: response.credential,
                }
            );

            localStorage.setItem("token", result.data.token);

            console.log("Logged in:", result.data.user);

            window.location.reload();
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
                console.log("Google Login Failed");
            }}
        />
    );
};

export default GoogleLoginButton;