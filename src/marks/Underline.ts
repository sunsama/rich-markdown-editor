import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

const UNDERLINE_INPUT_REGEX = /(?:^|[^\+\+])(\+\+([^\+\+]+)\+\+)$/;

function isUnderlined(dom: any) {
  return (
    dom.style.textDecoration === "underline" ||
    dom.style["text-decoration"] === "underline" ||
    dom.style["text-decoration-line"] === "underline"
  );
}

export default class Underline extends Mark {
  get name() {
    return "underline";
  }

  get schema() {
    return {
      attrs: {
        style: {
          default: "text-decoration:underline;",
        },
      },
      toDOM: node => ["span", { style: node.attrs.style }],
      parseDOM: [
        {
          tag: "span",
          getAttrs: dom =>
            isUnderlined(dom) ? { style: "text-decoration:underline;" } : false,
        },
        {
          tag: "div",
          getAttrs: dom =>
            isUnderlined(dom) ? { style: "text-decoration:underline;" } : false,
        },
        { tag: "u" },
        { tag: "ins" },
      ],
    };
  }

  inputRules({ type }) {
    return [markInputRule(UNDERLINE_INPUT_REGEX, type)];
  }

  keys({ type }) {
    return {
      "Mod-u": toggleMark(type),
      "Mod-U": toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: "++",
      close: "++",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  get markdownToken() {
    return "u";
  }

  parseMarkdown() {
    return {
      mark: "underline",
    };
  }
}
