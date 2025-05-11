import functions from "firebase-functions";
import { default as next } from "next";

const nextApp = next({
  dev: false,
  conf: { distDir: ".next" },
});

const handle = nextApp.getRequestHandler();

exports.nextApp = functions.https.onRequest(async (req, res) => {
  await nextApp.prepare();
  return handle(req, res);
});
