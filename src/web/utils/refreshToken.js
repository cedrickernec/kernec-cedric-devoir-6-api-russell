export async function tryRefreshToken(req) {

    const refreshToken = req.session?.user?.refreshToken;

    if (!refreshToken) return false;

    try {
        const response = await fetch("http://localhost:3000/api/auth/refresh", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) return false;

        const data = await response.json();

        req.session.user.token = data.accessToken;

        return true;

    } catch (error) {
        console.error("Erreur refresh token :", error.message);
        return false;
    }
}