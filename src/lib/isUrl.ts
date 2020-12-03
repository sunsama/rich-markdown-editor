export default function isUrl(text: string) {
  try {
    new URL(text);
    return true;
  } catch (err) {
    try {
      new URL(`https://${text}`);
      return true;
    } catch (err) {
      return false;
    }
  }
}
