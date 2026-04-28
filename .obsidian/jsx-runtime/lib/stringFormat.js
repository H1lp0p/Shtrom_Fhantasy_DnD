const format = (template, values) => {
  return template.replace(/\$\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? values[key] : match;
  });
};

module.exports = format;
