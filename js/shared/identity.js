// =============================================================================
// THE HUMAN ARCHIVE — SHARED IDENTITY
// Stores the Space Archaeologist assignment and manages one reusable SVG badge.
// =============================================================================

(() => {
    const STORAGE_KEY = "thaIdentityAssigned";
    window.THA = window.THA || {};

    // localStorage can be disabled by browser privacy settings; keep a session fallback.
    function isAssigned() {
        try {
            return window.localStorage.getItem(STORAGE_KEY) === "true";
        } catch (error) {
            return Boolean(window.THA.identityAssigned);
        }
    }

    // Create the badge once, then move the same node between its valid locations.
    function ensureBadge() {
        let badge = document.getElementById("thaGlobalIdentityBadge");
        if (badge) return badge;

        badge = document.createElement("aside");
        badge.id = "thaGlobalIdentityBadge";
        badge.className = "tha-global-identity-badge";
        badge.hidden = true;
        badge.setAttribute("aria-label", "Space Archaeologist identity badge");
        badge.innerHTML = `
            <span class="tha-global-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 40 40" focusable="false">
                    <circle cx="20" cy="20" r="5.5" fill="none" stroke="currentColor" stroke-width="1.4" />
                    <ellipse cx="20" cy="20" rx="17" ry="7.5" fill="none" stroke="currentColor" stroke-width="1.1" transform="rotate(-28 20 20)" />
                    <circle cx="33.5" cy="12.5" r="2" fill="currentColor" />
                </svg>
            </span>
            <span class="tha-global-badge-copy">
                <strong>SPACE ARCHAEOLOGIST</strong>
                <small>IDENTITY ASSIGNED</small>
            </span>`;
        document.body.appendChild(badge);
        return badge;
    }

    function moveToBody() {
        const badge = ensureBadge();
        if (badge.parentElement !== document.body) document.body.appendChild(badge);
        badge.classList.remove("is-in-menu-header");
        return badge;
    }

    function hide() {
        const badge = moveToBody();
        badge.hidden = true;
    }

    function assign() {
        window.THA.identityAssigned = true;
        try {
            window.localStorage.setItem(STORAGE_KEY, "true");
        } catch (error) {
            console.info("Identity will persist for this session only because localStorage is unavailable.");
        }
    }

    function show() {
        const badge = moveToBody();
        badge.hidden = false;
        return badge;
    }

    function mountInMenu() {
        const badge = ensureBadge();
        const slot = document.getElementById("thaMenuIdentitySlot");
        if (!isAssigned()) {
            badge.hidden = true;
            return badge;
        }

        if (slot) {
            slot.appendChild(badge);
            badge.classList.add("is-in-menu-header");
        } else {
            moveToBody();
        }
        badge.hidden = false;
        return badge;
    }

    function restoreForCurrentRoute() {
        const assigned = isAssigned();
        window.THA.identityAssigned = assigned;
        const badge = ensureBadge();
        if (!assigned) {
            badge.hidden = true;
        } else if (document.getElementById("thaMenuIdentitySlot")) {
            // In the Main Menu the sticky topbar keeps the badge at the upper-right.
            mountInMenu();
        } else {
            // The script says the assigned badge remains visible on every screen,
            // including after a returning user reloads the opening experience.
            show();
        }
    }

    window.THAIdentity = {
        isAssigned,
        ensureBadge,
        moveToBody,
        hide,
        assign,
        show,
        mountInMenu,
        restoreForCurrentRoute
    };

    // Restore once the first route has had a chance to render.
    const restore = () => window.setTimeout(restoreForCurrentRoute, 0);
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", restore, { once: true });
    } else {
        restore();
    }
})();
