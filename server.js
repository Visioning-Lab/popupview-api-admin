require('dotenv').config()
const express = require('express')
  , flash = require('express-flash')
  , cookieParser = require('cookie-parser')
  , partials = require('express-partials')
  , app = express();
const path = require('path')

const logger = require('./config/logger.js');
const service = "server";

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use('/static', express.static('public'))
app.use(partials());

app.use(require('express-session')({
  secret: process.env.APP_SECRET,
  resave: true,
  saveUninitialized: false
}))

const { ExpressOIDC } = require('@okta/oidc-middleware')
const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: `${process.env.HOST_URL}/authorization-code/callback`,
  scope: 'openid profile'
})

app.use(oidc.router)
app.use(cookieParser())
app.use(flash())

app.get('/logout', (req, res) => {
  if (req.userContext) {
    const idToken = req.userContext.tokens.id_token
    const to = encodeURI(process.env.HOST_URL)
    const params = 'id_token_hint='+idToken+'&post_logout_redirect_uri='+to
    req.logout()
    res.redirect(process.env.OKTA_ORG_URL+'/oauth2/default/v1/logout?'+params)
  } else {
    res.redirect('/')
  }
})

app.use('/', require('./routes/appRoutes'))

const port = process.env.PORT || 3010
app.listen(port, () => console.log(`App listening on port ${port}`))

logger.info({
	service: service,
	message: 'Administration server started on: ' + port
}); 