document.addEventListener('DOMContentLoaded', () => {
    // Initialize LocalStorage if not set
    if (!localStorage.getItem('human_archive_progress')) {
        const initialProgress = {
            unlockedMoon: 0,
            unlockedMars: 0,
            badgeAssigned: false,
            userLog: null
        };
        localStorage.setItem('human_archive_progress', JSON.stringify(initialProgress));
    }

    // Start with Splash Screen
    router.navigateTo('splash');
});