const express = require("express");
const app = express();
const port = 3000;
const mockData = require("./MOCK_DATA.json");
const colors = require("colors/safe");

app.use((req, res, next) => {
  const now = new Date();
  const query = req.originalUrl.replace(req.path, "");
  console.log(
    `[${colors.dim(now.toISOString())}] ${colors.green(
      req.method
    )} ${colors.brightCyan(req.path)}${colors.bgYellow(query)}`
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

/*
- GET /api/snippets/:id
*/
app.get("/api/snippets/:id", (req, res) => {
  const idParam = Number(req.params.id);
  const snippet = mockData.find((snippet) => snippet.id === idParam);
  if (snippet) {
    res.json(snippet);
  } else {
    res.status(404).json({ error: "Snippet not found" });
  }
});

/*
- GET /api/snippets
  - Filter by author (?author=lshitliff0)
  - Filter by multiple authors (?author=lshitliff0&author=foo)
*/
app.get("/api/snippets", (req, res) => {
  let snippets;
  if ("author" in req.query) {
    const authors = Array.isArray(req.query.author)
      ? req.query.author
      : [req.query.author];
    snippets = mockData.filter((snippet) => authors.includes(snippet.username));
  } else {
    snippets = mockData;
  }

  res.json(snippets);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
