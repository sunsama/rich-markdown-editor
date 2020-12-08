import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";
import { baseKeymap } from "prosemirror-commands";

export default class LastKeys extends Extension {
  get name() {
    return "last-keys";
  }

  get priority() {
    return -1;
  }

  keys({ type }) {
    if (this.options.enterToSave) {
        return {
          "Enter": (state, dispatch) => {
              this.options.onSaveAndExit();
              return true;
          },
          "Mod-Enter": baseKeymap["Enter"],
        };
    } else {
        return {};
    }
  }
}
