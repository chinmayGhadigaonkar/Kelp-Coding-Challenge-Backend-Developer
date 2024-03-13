import fs from "fs";
const CsvToJsonConversion = (csvFilePath) => {
  let csvfile = fs.readFileSync(csvFilePath);
  let data = csvfile.toString();

  let arr = data.split("\n");
  const header = arr[0].split(",").map((header) => header.trim());

  let jsonObject = [];

  for (let i = 1; i < arr.length; i++) {
    const currentRow = arr[i].split(",");
    const obj = {};

    for (let j = 0; j < header.length; j++) {
      // Remove leading/trailing whitespace from property values

      let [propertyName, propertyKey] = header[j].split("__");
      if (propertyKey) {
        // If property contains '__', it's a nested property
        propertyName = propertyName.slice(1);
        if (!obj[propertyName]) {
          obj[propertyName] = {};
        }
        obj[propertyName][propertyKey.slice(0, -1)] = currentRow[j]
          .trim()
          .slice(1, -1);
      } else {
        if (propertyName === "age") {
          obj[propertyName.slice(1, -1)] = parseInt(
            currentRow[j].trim().slice(1, -1),
          );
        } else {
          obj[propertyName.slice(1, -1)] = currentRow[j].trim().slice(1, -1);
        }
      }
    }
    jsonObject.push(obj);
  }
  return jsonObject;
};

export default CsvToJsonConversion;
