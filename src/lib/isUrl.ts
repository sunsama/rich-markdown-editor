
export const URL_INPUT_REGEX = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

export default function isUrl(text: string) {
  return (text || '').match(URL_INPUT_REGEX);
}
