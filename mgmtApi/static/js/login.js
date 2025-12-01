

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        

        try {
            const response = await fetch("/login", {
                method: "POST",
                body : formData,
            });
            const data = await response.json();
            if(response.ok){
                localStorage.setItem("token", data.token);
                console.log("Token saved:", data.token);


                // alert("Login successful");
                window.location.href = "/";
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("error during login:", error);
            alert("An error occured. Please try again");
        
        }
    });
});
