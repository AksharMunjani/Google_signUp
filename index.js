const express = require('express');
const session = require('express-session')
const passport = require('passport');
const app = express();
require('./auth')

function isLoggedIn(req, res, next) {
    req?.user ? next() : res.sendStatus(401)
}

app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>')
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get('/auth/google/redirect',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
);

app.get('/auth/failure', (req, res) => {
    res.send('something went wrong..')
});

app.get('/protected', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.displayName}`)
});

app.get('/logout', (req, res) => {
    req.logout();
    res.send("Goodbye!")
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server Running on http://localhost:${PORT}`);
});