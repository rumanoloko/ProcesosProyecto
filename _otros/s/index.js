const passport=require("passport");
const cookieSession=require("cookie-session");
require("./servidor/passport-setup.js");

app.use(cookieSession({
    name: 'Sistema',
    keys: ['key1', 'key2']
}));

app.use(passport.initialize());
app.use(passport.session());
app.get("/auth/google",passport.authenticate('google', { scope: ['profile','email'] }));

app.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/fallo' }),
    function(req, res) {
    res.redirect('/good');
}
);
app.get("/good", function(request,response){
    let nick=request.user.emails[0].value;
    if (nick){
        sistema.agregarUsuario(nick);
    }
    //console.log(request.user.emails[0].value);
    response.cookie('nick',nick);
    response.redirect('/');
});
app.get("/fallo",function(request,response){
    response.send({nick:"nook"})
});

