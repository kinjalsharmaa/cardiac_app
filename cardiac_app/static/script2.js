document.addEventListener("DOMContentLoaded", () => {
    // Function to show the notification
    const showNotification = () => {
        const notification = document.getElementById("bp-notification");
        notification.classList.remove("hidden"); // Show the notification
    };

    // Function to close the notification
    const closeNotification = () => {
        const notification = document.getElementById("bp-notification");
        notification.classList.add("hidden"); // Hide the notification
    };

    // Attach the close button event listener
    document.getElementById("close-notification").addEventListener("click", closeNotification);

    // Delay the notification appearance by 10 seconds
    setTimeout(showNotification, 20000);
});

