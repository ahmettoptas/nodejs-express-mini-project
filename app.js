const express = require("express");
const app = express();
const fs = require("fs");
const {getAdmin, auth, sign, verify } = require("./verifyToken");

const { readFile } = fs;
var morgan = require("morgan");
const { users } = require("./users");

app.use(express.json());
const logPath = "./logs.txt";

app.use(
  morgan("common", { stream: fs.createWriteStream(logPath, { flags: "a" }) })
);

app.get("/", (req, res) => {
  res.status(200).send(`<h1>The Main Page!</h1>
  <p>Simple main paragraph...</p>`);
});

app.get("/about", (req, res) => {
  res.status(200).send(`<h1>The About Page!</h1>
  <p>Simple about paragraph...</p>`);
});

app.get("/logs", (req, res) => {
  readFile(logPath, "utf8", (err, data) => {
    if (err) res.status(400).send({ message: "error" });
    else {
      const splittedData = data.split("\n").slice(0, -1);
      res.status(200).json(splittedData);
    }
  });
});

app.get("/admin", getAdmin);

app.post("/login", verify);

app.post("/sign", sign);

app.get("/users", auth, (req, res) => {
  res.json(users);
});

app.post("/users", auth, (req, res) => {
  const { name, surName, id } = req.body;
  if (name && surName && id) {
    users.push({ name, surName, id });
    res.status(201).json({ name, surName, id });
  } else res.status(400).json({ message: "Please fill all fields" });
});

app.put("/users/:id", auth, (req, res) => {
  const { name, surName, id } = req.body;
  const id_param = req.params.id;

  if (name && surName && id) {
    var user = users.find((ele) => ele.id == Number(id_param));

    if (user) {
      var index = users.indexOf(user);

      users[index] = { name, surName, id };
      res.status(200).json(users[index]);
    } else {
      res.json({ message: "User is not found!" });
    }
  } else res.json({ message: "Please fill all fields" });
});

app.patch("/users/:id", auth, (req, res) => {
  const { name, surName, id } = req.body;
  const id_param = req.params.id;

  var user = users.find((ele) => ele.id == Number(id_param));
  if (!user) return res.status(400).json({ message: "User is not found!" });
  if (name || surName || id) {
    if (name) user.name = name;

    if (surName) user.surName = surName;

    if (id) user.id = id;

    res.status(200).json(user);
  } else res.status(400).json({ message: "Please define some fields!" });
});

app.delete("/users/:id", auth, (req, res) => {
  var user = users.find((ele) => ele.id == Number(id_param));
  if (!user) return res.status(400).json({ message: "User is not found!" });

  users = users.filter((user_ele) => user_ele !== user);
  res.status(200).json({ message: "User is deleted", user });
});

app.listen(5000);
