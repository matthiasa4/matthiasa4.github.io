module.exports = async function (eleventyConfig) {
  // Dynamically import the ES module
  const { default: Shiki } = await import("@shikijs/markdown-it");
  
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
