import { toggleMark } from "prosemirror-commands";
import Mark from "./Mark";

export default class Underline extends Mark {
  get name() {
    return "underline";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "u" },
        { style: "text-decoration", getAttrs: value => value === "underline" },
      ],
      toDOM: () => ["span", {
          style: "text-decoration: underline"
      },0],
    };
  }

  keys({ type }) {
    return {
      "Mod-u": toggleMark(type),
      "Mod-U": toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: '<span style="text-decoration: underline">',
      close: '</span>',
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "underline" };
  }
}
