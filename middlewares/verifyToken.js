import jwt from 'jsonwebtoken'

export function verifyToken(req, res, next) {
  const header = req.headers.authorization;
  const token = header.split(" ")[1];
  // Bearer kjcjskackjadcef.yytreasczxvvbhg.eqdszciozxjknwef
  if (!token) return res.status(401).json({message: "No token provided"});

  jwt.verify(token, 'asecretpassword', (err, user) => {
      if (err) return res.status(403).json({message: "Invalid token"});
      req.user = user;
      next();
  })
}
