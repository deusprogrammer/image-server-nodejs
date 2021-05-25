const jwtStrategy = require('passport-jwt/lib/strategy')
const extractJwt = require('passport-jwt/lib/extract_jwt')

import authConfig from './authConfig'

export let jwtAuthStrategy = new jwtStrategy({
    secretOrKey: authConfig.key,
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken()
}, async (token, done) => {
    try {
        return done(null, token.user);
    } catch (error) {
        return done(error);
    }
})