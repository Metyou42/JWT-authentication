# JWT authentication

#### Implementation of jwt authentication in REST API App

## Used technology

- Node.js/Express
- cors
- MongoDB
- cookie-parser
- dotenv
- nodemailer
- jsonwebtoken
- bcrypt
- uuid
- class ApiError
- express-validator

## Opportunities

- Get all users in JSON (GET)
- Activations link send to user email, and ater folowing, activate account (GET)
- Refresh link for frontend interceptor (GET)
- Registration account, and create refresh and access token (POST)
- Login in account (POST)
- Logout from account (POST)

For all request, sends access token, if access token is invalid, server response status code 401 Unauthorized, and frontend interceptor request api/refresh with refresh token in HTTPOnlyCookie to get new tokens, if refresh token is invalid, user need to new authentication

## Guide how to use

| ApiKey                  | Descriptions                                                              |
| ----------------------- | ------------------------------------------------------------------------- |
| GET api/users           | Get all users in JSON format, only for logined users                      |
| GET api/activate/{link} | Send to email after registration, and activate account                    |
| GET api/refresh/        | HTTPOnlyCookie - refresh token, refresh tokens and give new couple tokens |
| POST api/registration   | Create new user, req.body - {email, password}                             |
| POST api/login          | Login in account, req.body - {email, password}                            |
| POST api/logout         | logout from account                                                       |
