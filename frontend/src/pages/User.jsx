import { useParams } from "react-router-dom";

const User = () => {
    let { username } = useParams();
    return (
        <p>Melisma User {username}</p>
    );
};

export default User;
