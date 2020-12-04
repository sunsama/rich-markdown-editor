import { setBlockType } from "prosemirror-commands";
import Node from "./Node";

export default class EmptyLine extends Node {
  get name() {
    return "empty_line";
  }

  get schema() {
    return {
      group: "block",
      parseDOM: [{ tag: "br" }],
      toDOM() {
        return ["br"];
      },
    };
  }

  commands({ type }) {
    return () => setBlockType(type);
  }

  toMarkdown(state, node) {
    // render empty paragraphs as hard breaks to ensure that newlines are
    // persisted between reloads (this breaks from markdown tradition)
    state.write("\\\n");
  }

  parseMarkdown() {
    return { block: "empty_line" };
  }
}
