import passport from "passport";
import passportJWT from "passport-jwt";
import User from "../db/models/User.js";

const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};


passport.use(
  new Strategy(params, async (req, payload, done) => {
    try {
      const token = ExtractJWT.fromAuthHeaderAsBearerToken()(req);
      const user = await User.findOne({ where: { id: payload.id } });
      if (!user || user.token !== token) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      return done(error, false);
    }
  })
);
