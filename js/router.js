// js/router.js
// Dynamic Single Page Application (SPA) Router

const router = {
    currentScreen: 'splash',

    navigateTo: function(screenName, recordId = null) {
        this.currentScreen = screenName;
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = ''; // Clear container

        switch(screenName) {
            case 'splash':
                if (typeof renderSplash === 'function') app.appendChild(renderSplash());
                break;
            case 'terminal':
                if (typeof renderTerminal === 'function') app.appendChild(renderTerminal());
                break;
            case 'menu':
                if (typeof renderMenu === 'function') app.appendChild(renderMenu());
                break;
            case 'moonMap':
                if (typeof renderMoonMap === 'function') app.appendChild(renderMoonMap());
                break;
            case 'marsMap':
                if (typeof renderMarsMap === 'function') app.appendChild(renderMarsMap());
                break;
            case 'templateA':
                if (typeof renderTemplateA === 'function') app.appendChild(renderTemplateA(recordId));
                break;
            case 'templateB':
                if (typeof renderTemplateB === 'function') app.appendChild(renderTemplateB(recordId));
                break;
            case 'templateC':
                if (typeof renderTemplateC === 'function') app.appendChild(renderTemplateC(recordId));
                break;
            case 'archive99':
                if (typeof renderArchive99 === 'function') app.appendChild(renderArchive99());
                break;
            case 'yourArchive':
                if (typeof renderYourArchive === 'function') app.appendChild(renderYourArchive());
                break;
            case 'finale':
                if (typeof renderFinale === 'function') app.appendChild(renderFinale());
                break;
            default:
                if (typeof renderSplash === 'function') app.appendChild(renderSplash());
        }

        window.scrollTo(0, 0);
    }
};