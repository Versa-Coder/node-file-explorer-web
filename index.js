import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import listFiles from "./utils/listFiles.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("view engine", "ejs");

app.use("/assets", express.static(path.join(__dirname, "/assets")));

app.use(async (req, res, next) => {
  if (req.path === "/" && req.query.dir) {
    const dir = req.query.dir;
    console.log({ dir });
    app.use("/fake-path", express.static(dir));
  }
  next();
});

app.get("/", async (req, res, next) => {
  try {
    const view = "pages/home.ejs";
    let info = null;

    if (req.query.dir !== undefined) {
      const data = {};

      data["dir"] = req.query.dir;
      data["ext"] = req.query.ext
        ? req.query.ext.split(",").map((e) => e.trim())
        : [];
      data["contains"] = req.query.contains
        ? req.query.contains.split(",").map((e) => e.trim())
        : [];

      info = await listFiles(data);
    }

    res.render(view, { info, query: req.query });
  } catch (err) {
    next(err);
  }
});

app.use((error, req, res, next) => {
  res.render("pages/home", { error });
});

const port = 8089;
app.listen(port, () => {
  console.log(`Visit :::::::: http://localhost:${port}`);
});
