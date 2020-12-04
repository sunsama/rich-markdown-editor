import markdownit from "markdown-it";
import markPlugin from "markdown-it-mark";
import placeholderPlugin from "./placeholders";
import checkboxPlugin from "./checkboxes";
import embedsPlugin from "./embeds";
import breakPlugin from "./breaks";
import tablesPlugin from "./tables";
import noticesPlugin from "./notices";
import underlinePlugin from "markdown-it-plugin-underline";

export default function rules({ embeds, additionalMarkdownPlugins }) {
  const md = markdownit("default", {
    breaks: false,
    html: false,
  })
    .use(underlinePlugin)
    .use(embedsPlugin(embeds))
    .use(breakPlugin)
    .use(checkboxPlugin)
    .use(markPlugin)
    .use(placeholderPlugin)
    .use(tablesPlugin)
    .use(noticesPlugin);

  if (additionalMarkdownPlugins && additionalMarkdownPlugins.length) {
    return additionalMarkdownPlugins.reduce((md, plugin) => md.use(plugin), md);
  } else {
    return md;
  }
}
