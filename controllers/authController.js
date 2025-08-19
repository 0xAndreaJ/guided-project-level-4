import jwt from 'jsonwebtoken'

function basicAuth(req, res, next) {
  console.log("Reaches basic auth")
  const base64 = req.headers.authorization?.split(" ")[1];
  // Authorization: Basic 75hdjseowhfjkrundki3=
  // [Basic, 75hdjseowhfjkrundki3=]
  
  // const base64 = 75hdjseowhfjkrundki3=

  const decoded = Buffer.from(base64, 'base64').toString('ascii');
  // username:password  andreajmc:12345  codexAJ:password1
  const [username, password] = decoded.split(":")
  // [username, password]  [andreajmc, 12345]  [codexAJ, password1]
  // username = andreajmc;
  // password = 12345;

  // Validate information with storage
  if (username === "admin" && password === "1234") {
      return { username: "admin", password: "1234" }
  } else {
      res.status(401).json({
          message: "Invalid Credentials"
      })
  }
}

export async function login(req, res) {
  const auth = basicAuth(req.headers['authorization'] || '')
  if (auth) {
    const token = jwt.sign({ sub: 'admin' }, process.env.JWT_SECRET || '', { expiresIn: '1h' })
  }
  res.json({ token, expiresIn: 3600 })
}
