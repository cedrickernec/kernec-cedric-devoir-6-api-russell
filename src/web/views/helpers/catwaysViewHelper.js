// ==================================================
// VIEW HELPER - CREATE PAGE RENDER
// ==================================================

export const renderCreateCatwayPage = (res, {
    errors = {},
    globalError = null,
    formData = {},
    startNumber = null,
    endNumber = null
}) => {
    res.render("catways/create", {
        title: "Création d'un catway",
        activePage : "catways",
        errors,
        globalError,
        formData,
        startNumber,
        endNumber
    });
};

// ==================================================
// VIEW HELPER - EDIT PAGE RENDER
// ==================================================

export const renderEditCatwayPage = (res, {
    catway,
    errors = {},
    globalError = null
}) => {
    res.render("catways/edit", {
        title: "Édition d'un catway",
        activePage : "catways",
        catway,
        errors,
        globalError
    });
};