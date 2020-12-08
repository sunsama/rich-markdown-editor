
import { isEqual } from "lodash";
import Extension from "../lib/Extension";
import { baseKeymap } from "prosemirror-commands";

export default class LastKeys extends Extension {
  get name() {
    return "last-keys";
  }

  get priority() {
    return -1;
  }

  keys() {
    if (this.options.enterToSave) {
        return {
          "Enter": (state, dispatch) => {
              const path = state.doc.resolve(state.selection.from).path.reduce((path, node) => {
                if (node.type) {
                  path.push(node.type.name);
                }
                return path;
              }, []);

              if (isEqual(path, ["doc", "paragraph"])) {
                this.options.onSaveAndExit();
                return true;
              }
          },
          "Mod-Enter": baseKeymap["Enter"],
        };
    } else {
        return {};
    }
  }
}
