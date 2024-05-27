const passport = require('passport');
const { ExtractJwt, Strategy: JwtStrategy } = require('passport-jwt');
const { UserModel: User } = require('../model/user');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const setupPassport = () => {
    passport.use(
        new JwtStrategy(opts, (payload, done) => {
            User.findById(payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }

                    return done(null, false);
                })
                .catch(err => {
                    return done(err, false);
                });
        })
    );
};

const auth = passport.authenticate('jwt', { session: false });

module.exports = {setupPassport,auth};
