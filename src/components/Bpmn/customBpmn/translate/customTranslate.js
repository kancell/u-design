export default function customTranslate(translations) {
  return function (_template, _replacements) {
    let replacements = _replacements || {};
    // Translate
    let template = translations[_template] || _template;

    // Replace
    return template.replace(/{([^}]+)}/g, function (_, key) {
      let str = replacements[key];
      if (
        translations[replacements[key]] !== null &&
        translations[replacements[key]] !== undefined
      ) {
        str = translations[replacements[key]];
      }
      return str || '{' + key + '}';
    });
  };
}
