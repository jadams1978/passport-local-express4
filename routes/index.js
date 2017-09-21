

const express = require('express');
const passport = require('passport');
const Account = require('../models/account');
const Team = require('../models/team');
const League = require('../models/league');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('index', { user : req.user });
})

router.get('/profile', (req, res) => {
    if (!req.user) { res.redirect('/'); }
    if (req.user) {
        console.log(req.user);
        League
            .find({'createdBy':req.user._id}) 
            .exec()
            .then(leagues => {
                console.log(leagues)
                res.render('profile', { user : req.user, leagues: leagues });
            }) 
    }
    
});
router.get('/league/:id', (req, res) => {
    if (!req.user) { res.redirect('/'); }
    if (req.user) {
        console.log(req.params.id);
        League
            .findOne({'_id':req.params.id}) 
            .exec()
            .then(league => {
                console.log(league)
                res.render('league', { leaguename: league.leaguename, john: "adams", teams: league.teams });
            }) 
    }
    
});
router.post('/create-league', (req, res) => {
	League.create({'leaguename':req.body.leaguename, 'createdBy':req.user._id})
        //res.render('index', { user : req.user });
        res.redirect('/profile');
});


router.get('/register', (req, res) => {
    res.render('register', { });
});

router.post('/register', (req, res, next) => {
    Account.register(new Account({ username : req.body.username }), req.body.password, (err, account) => {
        if (err) {
          return res.render('register', { error : err.message });
        }

        passport.authenticate('local')(req, res, () => {
            req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect('/profile');
            });
        });
    });
});


router.get('/login', (req, res) => {
    res.render('login', { user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res, next) => {
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/profile');
    });
});

router.get('/logout', (req, res, next) => {
    req.logout();
    req.session.save((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/ping', (req, res) => {
    res.status(200).send("pong!");
});

module.exports = router;
