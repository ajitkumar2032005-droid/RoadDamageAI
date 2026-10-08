const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    const errorBox = document.getElementById("errorMessage");

    errorBox.style.display = "none";

    if (!username || !password) {
        errorBox.textContent = "Please enter username and password.";
        errorBox.style.display = "block";
        return;
    }

    try {

        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (data.success) {

            window.location.href = "/dashboard";

        } else {

            errorBox.textContent = data.message;
            errorBox.style.display = "block";
        }

    } catch (error) {

        console.error(error);

        errorBox.textContent =
            "Backend connection failed. Make sure Flask server is running.";

        errorBox.style.display = "block";
    }
});