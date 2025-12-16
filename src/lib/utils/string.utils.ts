/**
 * Lowercases the first character in the `string`.
 * @param {String} string
 * @returns {String}
 */
export const lowerCaseFirstLetter = (text: string) => {
  if (!text) {
    return "";
  }
  return text[0].toLowerCase() + text.slice(1);
};

export const isTextEditorContentEmpty = (editorContent: string) => {
  return editorContent.replace(/<(.|\n)*?>/g, "").trim().length === 0;
};
