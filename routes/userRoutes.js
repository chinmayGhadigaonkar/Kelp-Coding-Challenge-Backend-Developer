import { Router } from "express";
import client from "../config/connection.js";
import CsvToJsonConversion from "../utils/CsvtoJson.js";
import calculateAgeDistribution from "../utils/calculateAgeDistribution.js";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  client.query(`Select * from users`, (err, result) => {
    if (!err) {
      res.send(result.rows);
    }
  });
  client.end;
});

userRouter.post("/addData", (req, res) => {
  const path = process.env.CSV_FILE_PATH;
  const results = CsvToJsonConversion(path);
  console.log(results.length);
  const jsonData = results.map((row) => {
    return {
      name: row.name.first + " " + row.name.last,
      age: parseInt(row.age),
      address: JSON.stringify({
        line1: row.address.line1,
        line2: row.address.line2,
        city: row.address.city,
        state: row.address.state,
      }),
      additional_info: JSON.stringify({
        gender: row["gender"],
      }),
    };
  });
  let insertPromises = [];

  jsonData.forEach((user) => {
    let insertQuery = `INSERT INTO public.users(name, age, address, additional_info)
    VALUES('${user.name}', ${user.age}, '${user.address}', '${user.additional_info}')`;

    let promise = new Promise((resolve, reject) => {
      client.query(insertQuery, (err, result) => {
        if (!err) {
          resolve();
        } else {
          reject(err);
        }
      });
    });

    insertPromises.push(promise);
  });

  Promise.all(insertPromises)
    .then(() => {
      client.query(`SELECT * FROM users`, (err, result) => {
        if (!err) {
          const users = result.rows;
          const ageDistribution = calculateAgeDistribution(users);

          console.log("Age-Group % Distribution");
          for (let key in ageDistribution) {
            console.log(key.padEnd(10), ageDistribution[key]);
          }

          res.send("Data inserted successfully");
        } else {
          res.status(500).send("Error retrieving users data");
        }
      });
    })
    .catch((error) => {
      res.status(500).send("Error inserting user data: " + error);
    });
});

export default userRouter;
