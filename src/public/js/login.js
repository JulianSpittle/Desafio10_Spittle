const loginUser = async () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    try {
        const response = await fetch(`/api/sessions/login?user=${email}&pass=${password}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            console.log(`Error en la respuesta: ${response.status}`);
            return;
        }
        
        const data = await response.json();
        console.log(data);
        
        if (data.status === "OK") {
            console.log("inicio de sesión exitosa");
            window.location.href = "/products";
        } else {
            console.log('Fallo al iniciar sesión');
        }
    } catch (error) {
        console.log('Error en la petición', error);
    }
}

document.getElementById("btnLogIn").onclick = loginUser;