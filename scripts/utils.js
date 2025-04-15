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
