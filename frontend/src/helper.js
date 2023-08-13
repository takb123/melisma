const apiURL = "http://localhost:4000/api";

const defaultProfile = "https://cdn-icons-png.flaticon.com/512/634/634012.png?w=1380&t=st=1691895486~exp=1691896086~hmac=09e15f4039fddb3f23fe42b5caa32969807c0c2711c9bcb6327e8b9d9489520d";

// Will implement actual profile picture system ... soon
const getUserColor = (username) => {
    let sum = 0;
    for (let i = 0; i < username.length; ++i) {
        sum = (sum + username.charCodeAt(i)) % 6;
    }
    switch (sum) {
        case 0:
            return "red";
        case 1:
            return "orange";
        case 2:
            return "yellow";
        case 3:
            return "green";
        case 4:
            return "blue";
        case 5:
            return "purple";
        default:
            return "white";
    }
}

export { apiURL, defaultProfile, getUserColor };