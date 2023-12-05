export default function toCamelCase(text: String): String {
  return text
    .split(' ')
    .map((word, i) => {
      if (i !== 0) {
        const firstLet = word[0].toUpperCase();
        const secondPart = word.slice(1).toLowerCase();
        return firstLet + secondPart;
      }
      return word.toLowerCase();
    })
    .join('');
}
