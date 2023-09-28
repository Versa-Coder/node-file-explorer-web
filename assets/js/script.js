const app = {
  init() {
    this.doArrengeFiles();
  },

  doc(selector, parent = document) {
    return parent.querySelector(selector);
  },

  docs(selector, parent = document) {
    return parent.querySelectorAll(selector);
  },

  addClassList(list = [], doc = document) {
    list = Array.isArray(list) ? list : [list];
    list.forEach((c) => {
      doc.classList.add(c);
    });
  },

  doArrengeFiles() {
    try {
      const jsnDoc = this.doc("#jsonedFiles");
      const displayArea = this.doc("#filesDisplayArea");
      if (jsnDoc) {
        const data = JSON.parse(jsnDoc.innerText);

        if (data.list.length > 0) {
          data.list.forEach((file) => {
            const doc = document.createElement(`div`);
            this.addClassList(["col-sm-2"], doc);

            const elem = this.eachFileArrenge(file);

            doc.appendChild(elem);
            displayArea.appendChild(doc);
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  },

  eachFileArrenge(file) {
    const container = document.createElement(`div`);
    const html = file.html;
    this.addClassList(["container-fluid", "each-file"], container);

    const item = document.createElement(html.tag);

    for (let i in html.attrs) {
      item.setAttribute(i, html.attrs[i]);
    }

    const elem = /*html*/ `
      <div class="row">
        <div class="col-sm-12" item></div>
        <div class="col-sm-12">
          <div class="input-group">
            <input type="text" class="form-control" path>
            <button class="btn btn-light" copy>Copy</button>
          </div>
        </div>
      </div>
    `;

    container.innerHTML = elem;

    const pathInput = this.doc(`input[path]`, container);
    const copyBtn = this.doc(`button[copy]`, container);

    pathInput.value = file.path;
    this.doc(`div[item]`, container).appendChild(item);

    copyBtn.onclick = () => {
      pathInput.select();
      window.navigator.clipboard.writeText(pathInput.value);
    };

    return container;
  },
};

app.init();
