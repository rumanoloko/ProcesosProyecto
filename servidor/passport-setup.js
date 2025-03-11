const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//const {GoogleOneTapStrategy} = require("passport-google-one-tap");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
//clear
// const { OAuth2Client } = require('google-auth-library');
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;
//const GoogleOneTapStrategy = require('passport-google-one-tap').Strategy;
passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},function(email,password,done){
        sistema.loginUsuario({"email":email,"password":password},function(user){
            return done(null,user);
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});


passport.use(new GoogleOneTapStrategy(
        {
            //client_id:"xxxxxxx.apps.googleusercontent.com", //local
            client_id:"593170222026-hl59nasvk5e766r4g2e8jmbmn2dtf8ah.apps.googleusercontent.com", //prod-oneTap
            // clientSecret: "xxxx", //local
            clientSecret:"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", // prod-oneTap",
            verifyCsrfToken: false, // whether to validate the csrf token or not
        },
        function (profile, done) {
            return done(null, profile);
        }
    )
);
passport.use(new GoogleStrategy({
        clientID: "593170222026-hl59nasvk5e766r4g2e8jmbmn2dtf8ah.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

