export function computeCatwayStateKey({ catwayState, isOutOfService }) {

    if (isOutOfService) {
        return "HS";
    }

    if (catwayState === "bon état") {
        return "OK";
    }

    return "WARNING";
}