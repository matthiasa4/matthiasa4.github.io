module.exports = function (eleventyConfig) {
  // Copy the `css` directory to the output
  eleventyConfig.addPassthroughCopy("src/css");

  // Copy the `fonts` directory to the output
  eleventyConfig.addPassthroughCopy("src/fonts");

  // Copy the `images` directory to the output
  eleventyConfig.addPassthroughCopy("src/images");

  // Add Swiper CSS and JS files
  eleventyConfig.addPassthroughCopy({
    "node_modules/swiper/swiper-bundle.min.css": "css/swiper-bundle.min.css",
    "node_modules/swiper/swiper-bundle.min.js": "js/swiper-bundle.min.js"
  });

  // Add a readable date filter
  eleventyConfig.addFilter("dateReadable", dateObj => {
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  });

  // Add an ISO date filter
  eleventyConfig.addFilter("dateIso", date => {
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
      includes: "_includes"
    }
  };
};