import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import UserModel from '../models/user.model.js';

dotenv.config();

// Local strategy for login with email/password
passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await UserModel.findOne({ email });
                if (!user) return done(null, false, { message: 'Usuario no encontrado' });

                const valid = user.isValidPassword(password);
                if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// JWT strategy for protecting routes and "current" endpoint
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'default_jwt_secret'
};

passport.use(
    'jwt',
    new JWTStrategy(jwtOptions, async (payload, done) => {
        try {
            const user = await UserModel.findById(payload.id);
            if (!user) return done(null, false);
            return done(null, user);
        } catch (err) {
            return done(err, false);
        }
    })
);

export default passport;
