module.exports = async function (eleventyConfig) {
  // Dynamically import the ES module
  const { default: Shiki } = await import("@shikijs/markdown-it");
  const markdownItAnchor = require("markdown-it-anchor");
  const markdownItToc = require("markdown-it-toc-done-right");
  
  // Add Shiki syntax highlighting plugin
  const shiki = await Shiki({
    theme: "github-light",
    transformers: [
      {
        name: 'add-language-label',
        pre(node) {
          const lang = this.options.lang || 'text';
          node.properties['data-language'] = lang;
          this.addClassToHast(node, 'has-language-label');
        },
        line(node, line) {
          node.properties['data-line'] = line;
          this.addClassToHast(node, 'line');
        }
      }
    ]
  });
  
  eleventyConfig.amendLibrary("md", (mdLib) => {
    mdLib.use(shiki);
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.headerLink({
        safariReaderFix: true,
        symbol: '#',
        class: 'header-anchor'
      })
    });
    mdLib.use(markdownItToc, {
      containerClass: "table-of-contents",
      listClass: "toc-content",
      listType: "ul",
      level: [1, 2, 3, 4, 5, 6]
    });
  });

  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy("src/css");

  // Copy the `fonts` directory to the output
  eleventyConfig.addPassthroughCopy("src/fonts");

  // Copy the `images` directory to the output
  eleventyConfig.addPassthroughCopy("src/images");

  // Add Swiper CSS and JS files
  eleventyConfig.addPassthroughCopy({
    "node_modules/swiper/swiper-bundle.min.css": "css/swiper-bundle.min.css",
    "node_modules/swiper/swiper-bundle.min.js": "js/swiper-bundle.min.js",
  });

  // Add a readable date filter
  eleventyConfig.addFilter("dateReadable", (dateObj) => {
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // Add an ISO date filter
  eleventyConfig.addFilter("dateIso", (date) => {
    return date.toISOString();
  });

  // Add a filter to extract TOC
  eleventyConfig.addFilter("extractToc", function(content) {
    const tocMatch = content.match(/<nav class="table-of-contents">[\s\S]*?<\/nav>/);
    return tocMatch ? tocMatch[0] : '';
  });

  // Add a filter to remove TOC from content
  eleventyConfig.addFilter("removeToc", function(content) {
    return content.replace(/<nav class="table-of-contents">[\s\S]*?<\/nav>/, '');
  });

  // Create a collection for posts
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByTag("posts");
  });

  // Override default config
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
  };
};
