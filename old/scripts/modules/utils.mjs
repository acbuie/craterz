function flatten(obj) {
  const result = {};
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === "object") {
      const nested = flatten(obj[key]);
      for (const nestedKey of Object.keys(nested)) {
        result[`${key}.${nestedKey}`] = nested[nestedKey];
      }
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}

// Explode a column into multiple rows based on a separator
// Use case: Columns that have multiple types, like INT_MORPH3
function explodeColumn(data, key, separator = " / ") {
  return data.flatMap((row) => {
    const raw = row[key];
    const rawStr = raw !== undefined && raw !== null ? raw.toString() : "";
    const parts = rawStr
      ? rawStr.split(separator).map((s) => s.trim())
      : ["NA"];
    return parts.map((part) => ({ ...row, [key]: part }));
  });
}

function standardizeMissingValues(data, keys, NA_name = "NA") {
  data.forEach((row) => {
    keys.forEach((key) => {
      if (row[key] === undefined || row[key] === null || row[key] === "") {
        row[key] = NA_name;
      }
    });
  });
}

export { flatten, explodeColumn, standardizeMissingValues };
