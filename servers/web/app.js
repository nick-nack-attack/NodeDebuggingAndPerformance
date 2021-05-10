const config = require("./config")
const express = require("express")
const lib = require("./lib/playersClient")
const path = require("path")
const session = require("./session")
const requestLogger = require("../shared/lib/requestLogger")
const express_request_id = require("express-request-id")
const router = require("./router")

const playersClient = lib(config.players);
const expressRequestId = express_request_id();

const app = express();

app.use(expressRequestId);

app.set('x-powered-by', false);

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

// Specify node_modules location if not set from environment variables.
if (!('NODE_PATH' in process.env)) {
  process.env.NODE_PATH = path.resolve(__dirname, '../../node_modules');
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap/css', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(process.env.NODE_PATH, '/bootstrap/dist/js')));
app.use('/jquery/js', express.static(path.join(process.env.NODE_PATH, '/jquery/dist')));
app.use('/popper/js', express.static(path.join(process.env.NODE_PATH, '/popper.js/dist/umd')));

app.use(session);

app.use(async (request, response, next) => {
  if (request.session.playerId) {
    return next();
  }
  const result = await playersClient.create(request.id);
  request.session.playerId = result.body.id;
  return next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

/**
 * Request Logger
 */
app.use(requestLogger);

/**
 * Router
 */
app.use(router);

/**
 * 404 Re-router
 */
app.use((req, res) => {
  console.warn(new Date().toISOString(), req.method, req.originalUrl, '404')
  return res.status(404).render('404', {
    title: '404',
  });
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error(err);
  return res.status(500).render('500', {
    title: '500',
  });
});

module.exports = app;
