import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

const UNDERLINE_INPUT_REGEX = /<u>([\S\s]*?)<\/u>/;

export default class Underline extends Mark {
  get name() {
    return "underline";
  }

  get schema() {
    return {
      parseDOM: [
        { tag: "u" },
        { style: "text-decoration", getAttrs: value => value && value.indexOf("underline") > -1 },
      ],
      toDOM: () => ["span", {
          style: "text-decoration:underline"
      },0],
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(UNDERLINE_INPUT_REGEX, type),
    ];
  }

  keys({ type }) {
    return {
      "Mod-u": toggleMark(type),
      "Mod-U": toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: '<u>',
      close: '</u>',
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return {
      mark: "underline"
    };
  }
}
