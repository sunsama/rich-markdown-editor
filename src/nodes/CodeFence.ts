import refractor from "refractor/core";
import bash from "refractor/lang/bash";
import css from "refractor/lang/css";
import clike from "refractor/lang/clike";
import csharp from "refractor/lang/csharp";
import java from "refractor/lang/java";
import javascript from "refractor/lang/javascript";
import json from "refractor/lang/json";
import markup from "refractor/lang/markup";
import php from "refractor/lang/php";
import python from "refractor/lang/python";
import powershell from "refractor/lang/powershell";
import ruby from "refractor/lang/ruby";
import typescript from "refractor/lang/typescript";

import { setBlockType } from "prosemirror-commands";
import { textblockTypeInputRule } from "prosemirror-inputrules";
import copy from "copy-to-clipboard";
import Prism, { LANGUAGES } from "../plugins/Prism";
import Node from "./Node";

[
  bash,
  css,
  clike,
  csharp,
  java,
  javascript,
  json,
  markup,
  php,
  python,
  powershell,
  ruby,
  typescript,
].forEach(refractor.register);

export default class CodeFence extends Node {
  get languageOptions() {
    return Object.entries(LANGUAGES);
  }

  get languageOptionAliases() {
      return {
          js: 'javascript',
          jsx: 'javascript',
          ts: 'typescript',
          tsx: 'typescript',
      };
  }

  get name() {
    return "code_fence";
  }

  get schema() {
    return {
      attrs: {
        language: {
          default: "javascript",
        },
      },
      content: "text*",
      marks: "",
      group: "block",
      code: true,
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: "pre",
          preserveWhitespace: "full",
          getAttrs: (dom: HTMLElement) => ({
            language: dom.hasAttribute("language")
              ? this.sanitizeLanguage(dom.getAttribute("language"))
              : "javascript",
          }),
        },
      ],
      toDOM: node => {
        const button = document.createElement("button");
        button.innerText = "Copy";
        button.type = "button";
        button.addEventListener("click", this.handleCopyToClipboard(node));

        const select = document.createElement("select");
        select.addEventListener("change", this.handleLanguageChange);

        this.languageOptions.forEach(([key, label]) => {
          const option = document.createElement("option");
          const value = key === "none" ? "" : key;
          option.value = value;
          option.innerText = label;
          option.selected = node.attrs.language === value;
          select.appendChild(option);
        });

        return [
          "div",
          { class: "code-block" },
          [
            "pre",
            { language: select.value },
            ["code", { spellCheck: false }, 0],
          ],
        ];
      },
    };
  }

  commands({ type }) {
    return () => setBlockType(type);
  }

  keys({ type }) {
    return {
      "Shift-Ctrl-\\": setBlockType(type),
    };
  }

  sanitizeLanguage(language) {
      if (LANGUAGES[language]) {
          return language;
      }
      return this.languageOptionAliases[language] || 'none';
  }

  handleCopyToClipboard(node) {
    return () => {
      copy(node.textContent);
      if (this.options.onShowToast) {
        this.options.onShowToast("Copied to clipboard", "code_copied");
      }
    };
  }

  handleLanguageChange = event => {
    const { view } = this.editor;
    const { tr } = view.state;
    const element = event.target;
    const { top, left } = element.getBoundingClientRect();
    const result = view.posAtCoords({ top, left });

    if (result) {
      const transaction = tr.setNodeMarkup(result.inside, undefined, {
        language: element.value,
      });
      view.dispatch(transaction);
    }
  };

  get plugins() {
    return [
      Prism({
        name: this.name,
        deferred: !this.options.initialReadOnly,
      }),
    ];
  }

  inputRules({ type }) {
    return [textblockTypeInputRule(/^```$/, type)];
  }

  toMarkdown(state, node) {
    state.write("```" + (node.attrs.language || "") + "\n");
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write("```");
    state.closeBlock(node);
  }

  get markdownToken() {
    return "fence";
  }

  parseMarkdown() {
    return {
      block: "code_block",
      getAttrs: tok => ({ language: this.sanitizeLanguage(tok.info) }),
    };
  }
}
