const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config.js");

const app = express();

app.get("/", (req, res) => {
  const files = fs.readdirSync(config.path);
  const usercache = JSON.parse(fs.readFileSync(config.usercache, "utf8"));
  const table = [];
  files.forEach((file) => {
    const data = JSON.parse(
      fs.readFileSync(path.join(config.path, file), "utf8")
    );
    const walk = data.stats["minecraft:custom"]["minecraft:walk_one_cm"];
    const sprint = data.stats["minecraft:custom"]["minecraft:sprint_one_cm"];
    const total = walk + sprint;
    const uuid = file.split(".")[0];
    const name = usercache.find((user) => user.uuid === uuid).name;

    table.push({
      name,
      walk,
      sprint,
      total,
    });
    table.sort((a, b) => b.total - a.total);
  });

  res.send(`
    <style>
    body{
        background-color: #000000;
    }
    table {
            font-family: arial, sans-serif;
            border-collapse: collapse;
            width: 50%;
            margin: auto;
            vertical-align: middle;
        }

        td, th {
            border: 1px solid #eeeeee;
            text-align: left;
            padding: 8px;
            vertical-align: middle;
        }

        tr:nth-child(even) {
            background-color: #dddddd;
        }
        tr:nth-child(odd) {
            background-color: #ffffff;
        }
    </style>
    <table>
    <h1 style="text-align: center; color: #ffffff; padding-top:20px;">Distance Traveled</h1>    
    <tr>
            <th>Username</th>
            <th>Walk</th>
            <th>Sprint</th>
            <th>Total</th>
        </tr>
        ${table
          .map(
            (row) => `
            <tr>
                <td>${row.name}</td>
                <td>${row.walk}</td>
                <td>${row.sprint}</td>
                <td>${row.total}</td>
            </tr>
        `
          )
          .join("")}
    </table>
    `);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
