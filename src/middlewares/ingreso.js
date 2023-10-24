export const checkSession = (req, res, next) => {
    console.log('Checking session:', req.session);
  
    if (req.session && req.session.user) {
      console.log('Session exists:', req.session.user);
      next();
    } else {
      console.log('No session found, redirecting to /login');
      res.redirect("/login");
    }
  };
  export const checkAlreadyLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
      console.log("Usuario ya autenticado, redirigiendo a /profile");
      res.redirect("/profile");
    } else {
      console.log("Usuario no autenticado, procediendo...");
      next();
    }
  };