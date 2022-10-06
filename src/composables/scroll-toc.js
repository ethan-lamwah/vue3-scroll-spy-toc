import { ref, onMounted } from "vue";

export function useScrollToc(selector, tocOptions, observerOptions) {
  const _tocOptions = tocOptions || {};
  const _observerOptions = observerOptions || {};

  const currentSection = ref("");
  const toc = ref({});

  onMounted(() => {
    toc.value = getToc(selector, _tocOptions);
    if (toc.value === undefined) return;

    const nodes = document.querySelectorAll(toc.value.headerSelector);
    if (nodes === undefined) return;

    // Creating the intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting)
          //update current state if the target element intersects 
          //with the intersection observer's root or root margin
          currentSection.value = entry.target.getAttribute("id");
      });
    }, _observerOptions);

    nodes.forEach((target) => {
      observer.observe(target);
    });
  });
  return { currentSection, toc };
}

/**
 * Generate and set id attribute to headings using its own text, then return an Array contains toc headings
 * @param  {String} selector A selector for the element that wrap the article or content
 * @param  {Object} options Optional user options for configuration
 */
const getToc = (selector, options) => {
  const contentNode = document.querySelector(selector);
  if (!contentNode) return;

  const toc = { headers: [], headerSelector: "" };

  // Configurations
  const settings = {};
  const defaults = {
    headinglevels: "h2, h3, h4, h5, h6",
    appendAnchor: true,
    anchorClass: "toc-anchor",
    headerClass: "toc-header",
  };

  /**
   * Configure settings if options are provided
   * @param  {Object} options The user options
   */
  const configSettings = (options) => {
    for (var prop in defaults) {
      // return true if prop is a direct property of the object
      // true - overide default config
      // false - use default config
      settings[prop] = Object.hasOwn(options, prop)
        ? options[prop]
        : defaults[prop];
    }
  };

  /**
   * Generate ID using heading text
   * @param  {node} el The heading element
   */
  const GenerateID = (el) => {
    return el.innerText.toLowerCase().replace(/[^A-Za-z0-9]/g, "-");
  };

  // Configure settings
  configSettings(options || {});

  // Set toc header selector
  toc.headerSelector = `${selector} .${settings.headerClass}`;

  contentNode.querySelectorAll(settings.headinglevels).forEach((el) => {
    let id = el.getAttribute("id") || GenerateID(el);

    // Set ID
    el.setAttribute("id", id);

    // Set header class
    el.classList.add(settings.headerClass);

    // Append extracted heading to toc
    // h2 -> indent 1, h3 -> indent 2 etc.
    toc.headers.push({
      id: id,
      text: el.innerText,
      indent: parseInt(el.tagName.slice(1)) - 1,
    });

    // Create anchor tag
    if (settings.appendAnchor) {
      const anchor = document.createElement("a");
      anchor.classList.add(settings.anchorClass);
      anchor.href = `#${id}`;
      anchor.innerText = "#";
      el.appendChild(anchor);
    }
  });

  return toc;
};
