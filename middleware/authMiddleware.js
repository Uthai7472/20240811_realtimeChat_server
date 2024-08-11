const jwt = require('jsonwebtoken');

// For protected route server
const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ messaeg: 'Access denied. No token provided'});
    }

     try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

        req.user = decoded;

        next();
     } catch (error) {
        return res.status(401).json({ message: 'Invalid Token.'});
     }
}

// For verify protected route for client 
const verifyToken = (req, res) => {
   const {token} = req.body;
   console.log(token);

   if (!token) {
      return res.status(400).json({ valid: false, message: 'No token provided' });
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ valid: true, user: decoded });

   } catch (error) {
      return res.status(401).json({ valid: false, message: 'Invalid Token' });
   }
}

module.exports = {
   authMiddleware,
   verifyToken
};