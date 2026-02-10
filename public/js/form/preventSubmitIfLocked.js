/**
 * ===================================================================
 * PREVENT SUBMIT IF LOCKED
 * ===================================================================
 * - Script générique de protection des formulaires
 * - Désactive automatiquement les boutons submit si :
 *      - un champ possède data-locked="true"
 *      - un champ required est vide
 *      - un champ est invalide HTML5
 *      - en mode EDIT : aucune modification détectée
 * ===================================================================
 */

document.addEventListener("DOMContentLoaded", () => {

    const forms = document.querySelectorAll("form");

    forms.forEach(form => {

        const submitButtons = form.querySelectorAll("button[type='submit']");

        // ============================================================
        // EDIT MODE DETECTION (via data-initial)
        // ============================================================

        let initialData = null;

        if (form.dataset.initial) {
            try {
                initialData = JSON.parse(form.dataset.initial);
            } catch (e) {
                console.warn("preventSubmitIfLocked: dataset.initial invalide", e);
            }
        }

        const hasChanges = () => {
            if (!initialData) return true;

            return Object.keys(initialData).some((key) => {
                const el = form.elements.namedItem(key);
                if (!el || el.disabled) return false;

                const initialValue = String(initialData[key] ?? "").trim();
                const currentValue = String(el.value ?? "").trim();

                console.log("Comparing field:", key);
                console.log("initial:", initialValue);
                console.log("current:", currentValue);
                console.log("different:", currentValue !== initialValue);

                return currentValue !== initialValue;
            });
        };

        // ============================================================
        // CENTRALIZED FORM STATE CHECK
        // ============================================================

        const computeState = () => {

            const lockedFields = form.querySelectorAll("[data-locked='true']");

            const invalidFields = form.querySelectorAll(
                "input:invalid, textarea:invalid, select:invalid"
            );

            const emptyRequired = Array.from(
                form.querySelectorAll("input[required], textarea[required], select[required]")
            )
                .filter(el => !el.disabled)
                .filter(el => !el.value.trim());

            const noChanges = initialData ? !hasChanges() : false;

            return {
                isBlocked:
                    lockedFields.length > 0 ||
                    invalidFields.length > 0 ||
                    emptyRequired.length > 0 ||
                    noChanges
            };
        };

        const refreshState = () => {

            const state = computeState();

            console.log("----- REFRESH STATE -----");
            console.log("form action:", form.getAttribute("action"));
            console.log("lockedFields:", form.querySelectorAll("[data-locked='true']").length);
            console.log("invalidFields:", form.querySelectorAll("input:invalid").length);
            console.log("emptyRequired:", Array.from(
                form.querySelectorAll("input[required]")
            ).filter(el => !el.value.trim()).length);
            console.log("noChanges:", initialData ? !hasChanges() : "N/A");
            console.log("isBlocked:", state.isBlocked);

            submitButtons.forEach(btn => {
                btn.disabled = state.isBlocked;
            });
        };

        // ============================================================
        // SECURITY: SUBMIT BLOCK
        // ============================================================

        form.addEventListener("submit", (e) => {

            const { isBlocked } = computeState();

            if (isBlocked) {
                e.preventDefault();
            }
        });

        // ============================================================
        // OBSERVER OF CHANGES IN data-locked
        // ============================================================

        const observer = new MutationObserver(refreshState);

        form.querySelectorAll("input, textarea, select").forEach(input => {
            observer.observe(input, {
                attributes: true,
                attributeFilter: ["data-locked"]
            });
        });

        // ============================================================
        // MONITORING OF USER CHANGES
        // ============================================================

        form.addEventListener("input", refreshState);
        form.addEventListener("change", refreshState);

        // ============================================================
        // INITIAL STATUS
        // ============================================================

        refreshState();
    });
});