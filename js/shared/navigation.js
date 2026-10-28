// =============================================================================
// THE HUMAN ARCHIVE — SHARED NAVIGATION
// Every opening screen uses this one entry point for SPA transitions.
// =============================================================================

(() => {
    function goTo(routeName, recordId = null) {
        if (!routeName || typeof routeName !== "string") return false;

        try {
            // Check availability before routing so a missing later screen cannot
            // replace the currently visible Menu with a generic router error.
            if (typeof router !== "undefined" && router && typeof router.hasRoute === "function") {
                if (!router.hasRoute(routeName)) return false;
                return router.navigateTo(routeName, recordId) !== false;
            }

            // Compatibility fallback for older modules that expose navigateTo().
            if (typeof navigateTo === "function") return navigateTo(routeName, recordId) !== false;
        } catch (error) {
            console.error(`THE HUMAN ARCHIVE: route "${routeName}" could not be opened.`, error);
        }

        console.error(`THE HUMAN ARCHIVE: no router is available for route "${routeName}".`);
        return false;
    }

    window.THANavigation = { goTo };
})();
