export function handleAuthExpired(apiResponse, req, res) {

    if (!apiResponse || apiResponse.authExpired !== true) {
        return false;
    }

    req.session.destroy(() => {
        res.clearCookie("russell.sid");
        res.redirect("/");
    });

    return true
}