
import { includes, without, find } from 'lodash';
import { Plugin } from "prosemirror-state";
import Extension from "../lib/Extension";

export default class Keys extends Extension {
  get name() {
    return "keys";
  }

  get plugins() {
    return [
      new Plugin({
        props: {
          // we can't use the keys bindings for this as we want to preventDefault
          // on the original keyboard event when handled
          handleKeyDown: (vw, event) => {
            const matchingKey = find(this.options.keys, ({ keys }) => this.isMatchingKey(keys, event));
            if (matchingKey) {
                const { action, keys } = matchingKey;
                console.log(action, keys, event);
                switch(action) {
                    case 'save': {
                      event.preventDefault();
                      this.options.onSave();
                      return true;
                    }
                    case 'save_exit': {
                      event.preventDefault();
                      this.options.onSaveAndExit();
                      return true;
                    }
                    case 'cancel': {
                      event.preventDefault();
                      this.options.onCancel();
                      return true;
                    }
                    case 'newline': {
                      const { view } = this.editor;
                      event.preventDefault();
                      const tr = view.state.tr.insertText('\n');
                      console.log(tr);
                      view.dispatch(tr);
                      return true;
                    }
                    default: {
                        console.warn(`Unknown action specified in keys ${action}`);
                        return false;
                    }
                }
            }
            return false;
          },
        },
      }),
    ];
  }

  isMatchingKey(keys: string[], event) {
      const shouldHaveMeta = includes(keys, 'Meta');
      if (shouldHaveMeta && !event.metaKey) {
          return false;
      }
      const nonMetaKeys = without(keys, 'Ctrl', 'Cmd',  'Meta');
      return nonMetaKeys.includes(event.key);
  }
}
