async function doLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-pass").value;

  const res = await apiRequest("/auth/login", "POST", {
    email,
    password
  });

  if (res.error) {
    alert(res.error);
    return;
  }

  localStorage.setItem("user", JSON.stringify(res.user));

  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app").classList.add("visible");
}