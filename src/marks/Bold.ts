import { toggleMark } from "prosemirror-commands";
import markInputRule from "../lib/markInputRule";
import Mark from "./Mark";

export default class Bold extends Mark {
  get name() {
    return "strong";
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: "b",
          getAttrs: node => node.style.fontWeight != "normal" && null,
        },
        { tag: "strong" },
        {
          style: "font-weight",
          getAttrs: value =>
            ["bold", "bolder", "600", "700", "800", "900"].includes(value),
        },
        { style: "font-style", getAttrs: value => value === "bold" },
      ],
      toDOM: () => ["strong"],
    };
  }

  inputRules({ type }) {
    return [markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)];
  }

  keys({ type }) {
    return {
      "Mod-b": toggleMark(type),
      "Mod-B": toggleMark(type),
    };
  }

  get toMarkdown() {
    return {
      open: "**",
      close: "**",
      mixable: true,
      expelEnclosingWhitespace: true,
    };
  }

  parseMarkdown() {
    return { mark: "strong" };
  }
}
