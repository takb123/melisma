import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { signin } from "../redux/authSlice";

const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const response = await fetch("http://localhost:4000/api/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email, username, password,
                confirm_password: confirmPassword
            })
        });
        const json = await response.json();

        if (response.ok) {
            localStorage.setItem("auth", JSON.stringify(json));
            dispatch(signin(json));
            setIsLoading(false);
            navigate(-1);
        }
        else {
            setIsLoading(false);
            toast.error(`Error: ${json.error}`);
        }
    }

    return (
        <form className="signup" onSubmit={handleSubmit}>
            <div className="sign-form">
                <div className="title">Sign Up</div>

                <div className="input">
                    <label>Email</label>
                    <input type="text" onChange={e => setEmail(e.target.value)} value={email} /> 
                </div>

                <div className="input">
                    <label>Username</label>
                    <input type="text" onChange={e => setUsername(e.target.value)} value={username} /> 
                    <span className="req">Username must be 4-16 characters and must consist of lowercase alphabets, numbers, - or _</span>
                </div>

                <div className="input">
                    <label>Password</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} value={password} /> 
                    <span className="req">Password must be 8+ characters and must contain: a lowercase letter, an uppercase letter, a number, and a symbol</span>
                </div>

                <div className="input">
                    <label>Confirm Password</label>
                    <input type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} /> 
                </div>

                <div className={"button" + (isLoading ? " loading" : "")}>
                    <button className="signup">Sign Up</button>
                </div>
            </div>
        </form>
    );
};

export default SignUp;