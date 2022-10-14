# vue3-scroll-spy-toc

Hi, everyone! I created a composable function on Vue to simplify the implementation of table of contents(TOC) with scrolling active state effect using [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) and Vue's [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html).

This function is designed for **dynamic HTML rendering**. It’s useful when you are dealing with dynamic html contents via CMS. 

Check out this [post](https://www.ethanlam.dev/post/dynamic-table-of-contents-with-scroll-spy-effect-i) or [demo](https://ethanlam-vue3-scroll-spy-toc.netlify.app/), enjoys!

# How to use it?

Use the composable function `useScrollToc` from `src/composables/scroll-toc.js`

## useScrollToc

Use `useScrollToc` and pass it a defined query selector where your dynamic HTML content is located. Then retrieve the `currentSection` and `toc` .

Note that the `currentSection` indicates the current intersected section in the viewport, `toc` is an object that contains all information about the headings from your article. Both are `ref`.

```jsx
<script setup>
import { useScrollToc } from "@/composables/scroll-toc";

const { currentSection, toc } = useScrollToc(
  "article[data-toc-content]"
);
</script>
```

## Parameters of useScrollToc

**`selector`**

A group of [selectors](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Selectors) to match the dynamic post content.

e.g. passing  `"article[data-toc-content]"` as the argument if your content wraps in `article` with data attribute `data-toc-content`
\
\
\
**`tocOptions`**

The options to customize `toc` object. 

| Property | Description | Default | Type |
| --- | --- | --- | --- |
| headinglevels | Specify the heading selectors | h2, h3, h4, h5, h6 | string |
| appendAnchor | Specify whether to embed an anchor(#) to headings | true | boolean |
| anchorClass | Specify CSS class of the anchor tag | toc-anchor | string |
| headerClass | Specify CSS class of heading in table of contens | toc-header | string |

\
\
\
**`observerOptions`**

The `observerOptions` object is equivalent to [Intersection observer options](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API#intersection_observer_options) letting you control the circumstances under which the observer's callback is invoked.
\
\
\
Perfect! Let’s expose the result in template:

```html
<template>
  <main>
    <section>
      <!-- dynamic content here -->
      <article v-html="postContent" data-toc-content></article>
    </section>
    <aside>
      <section>
        <h2>Table of Contents</h2>
          <ul>
            <li v-for="header in toc.headers" :key="header.id">
              <a
                :href="`#${header.id}`"
                :class="{ active: header.id == currentSection }"
              >
                {{ header.text }}
              </a>
            </li>
          </ul>
      </section>
    </aside>
  </main>
</template>
```

## Table of Content Object - toc

`toc` is an object that contains headings detail to render table of contents in your code . The composable function will help you generate and set `id` attribute to headings using their own text. Then return an array containing toc headings.

## toc properties

**`headers`** 

An array contains a list of headings for your article.

* `id`: The id attribute of a heading

* `text`: The inner text of a heading

* `indent`: A scalar value that can be used to customize heading style like padding or margin.

Example:

```html
<ul>
    <li v-for="header in toc.headers" :key="header.id">
      <a
        :href="`#${header.id}`"
        :class="{ active: header.id == currentSection }"
        :style="{
          paddingLeft: Math.pow(2, header.indent) * 0.25 + 'rem',
        }"
      >
        {{ header.text }}
      </a>
    </li>
</ul>
```

# Reference

[Sticky ScrollSpy Table of Contents in Vue.js](https://medium.com/ascentic-technology/sticky-scrollspy-table-of-contents-in-vue-js-73d2d6f0a1cd) - Chamara Senarath