import {
  BlockQuoteIcon,
  BulletedListIcon,
  CodeIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HorizontalRuleIcon,
  OrderedListIcon,
  TableIcon,
  TodoListIcon,
  ImageIcon,
  StarredIcon,
  WarningIcon,
  InfoIcon,
  LinkIcon,
} from "outline-icons";
import { MenuItem } from "../types";

const SSR = typeof window === "undefined";
const isMac = !SSR && window.navigator.platform === "MacIntel";
const mod = isMac ? "⌘" : "ctrl";

export default function blockMenuItems(): MenuItem[] {
  return [
    {
      name: "heading",
      title: "Big heading",
      keywords: "h1 heading1 title",
      icon: Heading1Icon,
      shortcut: "^ ⇧ 1",
      attrs: { level: 1 },
    },
    {
      name: "heading",
      title: "Medium heading",
      keywords: "h2 heading2",
      icon: Heading2Icon,
      shortcut: "^ ⇧ 2",
      attrs: { level: 2 },
    },
    {
      name: "heading",
      title: "Small heading",
      keywords: "h3 heading3",
      icon: Heading3Icon,
      shortcut: "^ ⇧ 3",
      attrs: { level: 3 },
    },
    {
      name: "separator",
    },
    {
      name: "checkbox_list",
      title: "Todo list",
      icon: TodoListIcon,
      keywords: "checklist checkbox task",
      shortcut: "^ ⇧ 7",
    },
    {
      name: "bullet_list",
      title: "Bulleted list",
      icon: BulletedListIcon,
      shortcut: "^ ⇧ 8",
    },
    {
      name: "ordered_list",
      title: "Ordered list",
      icon: OrderedListIcon,
      shortcut: "^ ⇧ 9",
    },
    {
      name: "separator",
    },
    {
      name: "table",
      title: "Table",
      icon: TableIcon,
      attrs: { rowsCount: 3, colsCount: 3 },
    },
    {
      name: "blockquote",
      title: "Quote",
      icon: BlockQuoteIcon,
      shortcut: `${mod} ]`,
    },
    {
      name: "code_block",
      title: "Code block",
      icon: CodeIcon,
      shortcut: "^ ⇧ \\",
      keywords: "script",
    },
    {
      name: "hr",
      title: "Divider",
      icon: HorizontalRuleIcon,
      shortcut: `${mod} _`,
      keywords: "horizontal rule break line",
    },
    {
      name: "image",
      title: "Image",
      icon: ImageIcon,
      keywords: "picture photo",
    },
    {
      name: "link",
      title: "Link",
      icon: LinkIcon,
      shortcut: `${mod} k`,
      keywords: "link url uri href",
    },
    {
      name: "separator",
    },
    {
      name: "container_notice",
      title: "Info notice",
      icon: InfoIcon,
      keywords: "container_notice card information",
      attrs: { style: "info" },
    },
    {
      name: "container_notice",
      title: "Warning notice",
      icon: WarningIcon,
      keywords: "container_notice card error",
      attrs: { style: "warning" },
    },
    {
      name: "container_notice",
      title: "Tip notice",
      icon: StarredIcon,
      keywords: "container_notice card suggestion",
      attrs: { style: "tip" },
    },
  ];
}

// TODO Fill in any more that we need
export const extensionBlockNames = {
    horizontal_rule: ['hr']
}

