import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GoogleLoginButton = () => {
    const handleSuccess = async (response) => {
        try {
            const result = await axios.post(
                "http://localhost:5000/api/v1/auth/google",
                {
                    credential: response.credential,
                }
            );

            localStorage.setItem("token", result.data.token);

            console.log("Logged in:", result.data.user);
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