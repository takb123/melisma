let tokenResetTime = null;
let accessToken = null;

const getAccessToken = async () => {
    if (!accessToken || Date.now() >= tokenResetTime) {
        try {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `grant_type=client_credentials&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
            });
            const json = await response.json();
            accessToken = json.access_token;
            tokenResetTime = new Date(Date.now() + 50 * 60 * 1000);
        } catch (error) {
            throw new Error(error.message);
        }    
    }
    return accessToken;
};

module.exports = getAccessToken;