function selectUser() {
    const username = document.getElementById("username").value.trim();
    if (username !== "") {
        localStorage.setItem("selectedUser", username);
        window.location.href = "chat.html";
    } else {
        alert("Please enter a username.");
    }
}