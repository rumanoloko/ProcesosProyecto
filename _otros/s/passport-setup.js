const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});
passport.use(new GoogleStrategy({
        clientID: "1016847105004-stv7pcn1jr1c401fvp5gg3nh3385clab.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:3000/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));