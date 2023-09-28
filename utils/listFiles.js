import { stat, readdir } from "fs";
import path from "path";

export default function listFiles(
  aim = {
    dir: "name of the dir",
    ext: ["*"],
    contains: [],
  }
) {
  return new Promise((resolve, reject) => {
    readdir(aim.dir, (err, files) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const fData = {
          count: 0,
          ext: [],
          list: [],
        };

        aim.ext =
          !Array.isArray(aim.ext) || aim.ext.includes("*")
            ? []
            : aim.ext.map((e) => {
                e = e.trim();
                return e.length > 0 ? `.${e.toLowerCase()}` : e;
              });

        aim.contains = !Array.isArray(aim.contains)
          ? []
          : aim.contains.map((c) => c.toLowerCase());

        const extFilt =
          aim.ext.length < 1
            ? files
            : files.filter((f) =>
                aim.ext.includes(path.extname(f).toLowerCase())
              );

        const containsFilt =
          aim.contains.length < 1
            ? extFilt
            : extFilt.filter((e) =>
                aim.contains.some((c) => e.toLowerCase().includes(c))
              );

        fData.count = containsFilt.length;
        fData.list = containsFilt.map((c) => {
          const ext = path.extname(c).replace(".", "").toLowerCase();
          if (!fData.ext.includes(ext)) {
            fData.ext.push(ext);
          }

          const _path = path.join(aim.dir, c).replace(/(\\)+/gi, "/");
          const file = _path.split("/").pop();

          return {
            name: c,
            dir: aim.dir,
            path: _path,
            ext,
            html: {
              tag: "img",
              attrs: { src: `http://localhost:8089/fake-path/${file}` },
            },
          };
        });

        resolve(fData);
      } catch (err) {
        reject(err);
      }
    });
  });
}
