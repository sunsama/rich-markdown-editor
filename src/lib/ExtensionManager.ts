import { sortBy } from "lodash";
import { Schema } from "prosemirror-model";
import { keymap } from "prosemirror-keymap";
import { MarkdownParser } from "prosemirror-markdown";
import { MarkdownSerializer } from "./markdown/serializer";
import Editor from "../";
import Extension from "./Extension";
import makeRules from "./markdown/rules";
import { PluginSimple } from "markdown-it";
import Node from "../nodes/Node";
import Mark from "../marks/Mark";

export default class ExtensionManager {
  extensions: Extension[];
  embeds;
  additionalMarkdownPlugins: PluginSimple[];

  constructor(
    extensions: Extension[] = [],
    editor?: Editor,
    additionalMarkdownPlugins: PluginSimple[] = []
  ) {
    if (editor) {
      extensions.forEach(extension => {
        extension.bindEditor(editor);
      });
    }

    this.additionalMarkdownPlugins = additionalMarkdownPlugins;
    this.extensions = extensions;
    this.embeds = editor ? editor.props.embeds : undefined;
  }

  get nodes() {
    return this.extensions
      .filter(extension => extension.type === "node")
      .reduce(
        (nodes, node: Node) => ({
          ...nodes,
          [node.name]: node.schema,
        }),
        {}
      );
  }

  serializer() {
    const nodes = this.extensions
      .filter(extension => extension.type === "node")
      .reduce(
        (nodes, extension: Node) => ({
          ...nodes,
          [extension.name]: extension.toMarkdown,
        }),
        {}
      );

    const marks = this.extensions
      .filter(extension => extension.type === "mark")
      .reduce(
        (marks, extension: Mark) => ({
          ...marks,
          [extension.name]: extension.toMarkdown,
        }),
        {}
      );

    return new MarkdownSerializer(nodes, marks);
  }

  parser({ schema }) {
    const tokens = this.extensions
      .filter(
        extension => extension.type === "mark" || extension.type === "node"
      )
      .reduce((nodes, extension: Node | Mark) => {
        const md = extension.parseMarkdown();
        if (!md) return nodes;

        return {
          ...nodes,
          [extension.markdownToken || extension.name]: md,
        };
      }, {});

    return new MarkdownParser(
      schema,
      makeRules({
        embeds: this.embeds,
        additionalMarkdownPlugins: this.additionalMarkdownPlugins,
      }),
      tokens
    );
  }

  get marks() {
    return this.extensions
      .filter(extension => extension.type === "mark")
      .reduce(
        (marks, { name, schema }: Mark) => ({
          ...marks,
          [name]: schema,
        }),
        {}
      );
  }

  get plugins() {
    return this.extensions
      .filter(extension => extension.plugins)
      .reduce((allPlugins, { plugins }) => [...allPlugins, ...plugins], []);
  }

  keymaps({ schema }: { schema: Schema }) {
    return sortBy(
      this.extensions
        .filter(extension =>
          ["node", "mark", "extension"].includes(extension.type)
        )
        .filter(extension => extension.keys),
      (extension: Extension) => -extension.priority
    )
      .map((extension: Extension) =>
        extension.keys({
          type:
            extension.type === "extension"
              ? undefined
              : schema[`${extension.type}s`][extension.name],
          schema,
        })
      )
      .map((keys: Record<string, any>) => keymap(keys));
  }

  inputRules({ schema }: { schema: Schema }) {
    const extensionInputRules = this.extensions
      .filter(extension => ["extension"].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension => extension.inputRules({ schema }));

    const nodeMarkInputRules = this.extensions
      .filter(extension => ["node", "mark"].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension =>
        extension.inputRules({
          type: schema[`${extension.type}s`][extension.name],
          schema,
        })
      );

    return [...extensionInputRules, ...nodeMarkInputRules].reduce(
      (allInputRules, inputRules) => [...allInputRules, ...inputRules],
      []
    );
  }

  commands({ schema, view }) {
    return this.extensions
      .filter(extension => extension.commands)
      .reduce((allCommands, extension) => {
        const { name, type } = extension;
        const commands = {};
        const value = extension.commands({
          schema,
          ...(["node", "mark"].includes(type)
            ? {
                type: schema[`${type}s`][name],
              }
            : {}),
        });

        const apply = (callback, attrs) => {
          if (!view.editable) {
            return false;
          }
          view.focus();
          return callback(attrs)(view.state, view.dispatch, view);
        };

        const handle = (_name, _value) => {
          if (Array.isArray(_value)) {
            commands[_name] = attrs =>
              _value.forEach(callback => apply(callback, attrs));
          } else if (typeof _value === "function") {
            commands[_name] = attrs => apply(_value, attrs);
          }
        };

        if (typeof value === "object") {
          Object.entries(value).forEach(([commandName, commandValue]) => {
            handle(commandName, commandValue);
          });
        } else {
          handle(name, value);
        }

        return {
          ...allCommands,
          ...commands,
        };
      }, {});
  }
}
