const jwt = require('jsonwebtoken');

const generateToken = (payload ={}) =>{
    return jwt.sign({...payload}, process.env.JWT_SECRET, { expiresIn: '7d' });
}

const check =
  (...roles) =>
    (req, res, next) => {
      if (!req.user) {
        return res.status(401).send('Unauthorized');
      }

      const hasRole = roles.includes(req.user.role);
      if (!hasRole) {
        return res.status(403).send('You are not allowed to make this request.');
      }

      return next();
    };

module.exports = {
    generateToken,
    check
};