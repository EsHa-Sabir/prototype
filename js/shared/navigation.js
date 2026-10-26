/* =============================================================
   THE HUMAN ARCHIVE — SHARED NAVIGATION
   Provides one router entry point for all screen modules.
============================================================= */

(() => {
    function goTo(routeName, recordId = null) {
        try {
            if (typeof router !== "undefined" && router && typeof router.navigateTo === "function") {
                return router.navigateTo(routeName, recordId) !== false;
            }

            if (typeof navigateTo === "function") {
                return navigateTo(routeName, recordId) !== false;
            }
        } catch (error) {
            console.error(`THE HUMAN ARCHIVE: route "${routeName}" could not be opened.`, error);
        }

        console.error(`THE HUMAN ARCHIVE: no router is available for route "${routeName}".`);
        return false;
    }

    window.THANavigation = { goTo };
})();
