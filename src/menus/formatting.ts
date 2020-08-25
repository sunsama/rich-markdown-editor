import {
  BoldIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  ItalicIcon,
  BlockQuoteIcon,
  LinkIcon,
  StrikethroughIcon,
  InputIcon,
  HighlightIcon,
} from "outline-icons";
import { flatten } from 'lodash';
import { isInTable } from "prosemirror-tables";
import { EditorState } from "prosemirror-state";
import isInList from "../queries/isInList";
import isMarkActive from "../queries/isMarkActive";
import isNodeActive from "../queries/isNodeActive";
import { MenuItem } from "../types";

// TODO Fill in the rest
const extensionFormattingNames = {
    'highlight': ['mark'],
}

export default function formattingMenuItems(
  state: EditorState,
  isTemplate: boolean,
  disabledExtensions: string[] = [],
): MenuItem[] {
  const { schema } = state;
  const isTable = isInTable(state);
  const isList = isInList(state);
  const allowBlocks = !isTable && !isList;
  const disabledFormattingItems = flatten(disabledExtensions.map(extension => extensionFormattingNames[extension] || [extension]));

  return [
    {
      name: "placeholder",
      tooltip: "Placeholder",
      icon: InputIcon,
      active: isMarkActive(schema.marks.placeholder),
      visible: isTemplate,
    },
    {
      name: "separator",
      visible: isTemplate,
    },
    {
      name: "strong",
      tooltip: "Bold",
      icon: BoldIcon,
      active: isMarkActive(schema.marks.strong),
    },
    {
      name: "em",
      tooltip: "Italic",
      icon: ItalicIcon,
      active: isMarkActive(schema.marks.em),
    },
    {
      name: "strikethrough",
      tooltip: "Strikethrough",
      icon: StrikethroughIcon,
      active: isMarkActive(schema.marks.strikethrough),
    },
    {
      name: "mark",
      tooltip: "Highlight",
      icon: HighlightIcon,
      active: isMarkActive(schema.marks.mark),
      visible: !isTemplate,
    },
    {
      name: "code_inline",
      tooltip: "Code",
      icon: CodeIcon,
      active: isMarkActive(schema.marks.code_inline),
    },
    {
      name: "separator",
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: "Heading",
      icon: Heading1Icon,
      active: isNodeActive(schema.nodes.heading, { level: 1 }),
      attrs: { level: 1 },
      visible: allowBlocks,
    },
    {
      name: "heading",
      tooltip: "Subheading",
      icon: Heading2Icon,
      active: isNodeActive(schema.nodes.heading, { level: 2 }),
      attrs: { level: 2 },
      visible: allowBlocks,
    },
    {
      name: "blockquote",
      tooltip: "Quote",
      icon: BlockQuoteIcon,
      active: isNodeActive(schema.nodes.blockquote),
      attrs: { level: 2 },
      visible: allowBlocks,
    },
    {
      name: "separator",
    },
    {
      name: "link",
      tooltip: "Create link",
      icon: LinkIcon,
      active: isMarkActive(schema.marks.link),
      attrs: { href: "" },
    },
  ].filter(({ name }) => !disabledFormattingItems.includes(name))
   .filter(({ name }, idx, formattingItems) => {
       if (name === 'separator') {
           if (idx === 0 || idx === formattingItems.length - 1 || formattingItems[idx + 1].name === 'separator') {
               return false
           }
       }
       return true
   });
}
