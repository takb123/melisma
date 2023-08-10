import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signin } from "../redux/authSlice";

const SignIn = () => {
    const [userMail, setUserMail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const response = await fetch("http://localhost:4000/api/user/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email_username: userMail,
                password
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
            setError(json.error);
        }
    }

    return (
        <form className="signin" onSubmit={handleSubmit}>
            <div className="sign-form">
                <div className="title">Sign In</div>

                <div className="input">
                    <label>Username or Email</label>
                    <input type="text" onChange={e => setUserMail(e.target.value)} value={userMail} /> 
                </div>

                <div className="input">
                    <label>Password</label>
                    <input type="password" onChange={e => setPassword(e.target.value)} value={password} /> 
                </div>

                {error && <div className="error">{error}</div>}

                <div className={"button" + (isLoading ? " loading" : "")}>
                    <button className="signin">Sign In</button>
                </div>
            </div>
        </form>
    );
};

export default SignIn;