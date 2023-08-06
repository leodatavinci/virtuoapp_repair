import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import axios from 'axios';
import shopify from "./shopify.js";
import GDPRWebhookHandlers from "./gdpr.js";

import applyQrCodeApiEndpoints from "./middleware/pinecone-api.js";
import applyQrCodePublicEndpoints from "./middleware/pinecone-public.js";
import AdminAppApiEndpoints from "./middleware/admin-app-api.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/web/frontend/dist`
    : `${process.cwd()}/web/frontend/`;

const app = express();

app.use(express.json({
  verify: (req, res, buf, encoding) => {
    if (buf && buf.length) {
      req.rawBody = buf.toString(encoding || 'utf8');
    }
  }
}));

app.post("/api/webhooks", (req, res, next) => {
  console.log("Installing App");
  console.log(next);
  req.body = req.rawBody;
  next();
});

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  async (req, res, next) => {
    console.log('Received request for /api/auth/callback', req.query);
    try {
      let response = await axios.post('https://0ef3-3-224-230-92.ngrok-free.app/new_installation', req.query);
      console.log('Successfully forwarded OAuth data to Flask server:', response.data);
    } catch (error) {
      console.error('Error forwarding the OAuth data:', error);
    }
    next();
  },
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);

app.post(
  shopify.config.webhooks.path,
  async (req, res, next) => {
    const isAppUninstalledWebhook = req.get('X-Shopify-Topic') === 'app/uninstalled';
    if (isAppUninstalledWebhook) {
      console.log('Received app/uninstalled webhook');
      try {
        console.log("Req Body");
        const bodyAsObject = JSON.parse(req.body); // Convert body to object
        const domain = bodyAsObject.domain;  // Extract the domain
        console.log(domain);  // should print the domain
        const response = await axios.post('https://0ef3-3-224-230-92.ngrok-free.app/uninstallation', { domain });
        console.log('Successfully forwarded uninstallation data to Flask server:', response.data);
      } catch (error) {
        console.error('Error forwarding the uninstallation data:', error);
      }
    }
    next();
  },
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
);

app.post("/message-webhook", (req, res) => {
  const { app_session_id, content } = req.body;
  console.log(`Received message for session ${app_session_id}:`, content);
  res.sendStatus(200);
});

applyQrCodePublicEndpoints(app);
app.use("/api/*", shopify.validateAuthenticatedSession());

applyQrCodeApiEndpoints(app);
AdminAppApiEndpoints(app);

app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

app.listen(PORT);