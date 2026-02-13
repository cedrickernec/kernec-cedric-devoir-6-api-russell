(() => {

    const channel = new BroadcastChannel("russell-session");

    const justLoggedIn = document.body.dataset.justLoggedIn === "true";

    if (justLoggedIn) {
        channel.postMessage({ type: "LOGIN_SUCCESS" });
    }

    channel.onmessage = (event) => {
        const { type } = event.data || {};

        if (type !== "LOGIN_SUCCESS") return;

        // Sinon reload la page actuelle
        window.location.reload(true);
    };

})();