<script setup>
import { useScrollToc } from "@/composables/scroll-toc";
import postContent from "@/data/postContent";

const { currentSection, toc } = useScrollToc(
  "article[data-toc-content]",
  {},
  {
    rootMargin: "0px 0px -80% 0px",
  }
);
</script>
<template>
  <header>
    <h1>Vue3 ScrollSpy Table of Contents Demo</h1>
    <p>
      Hi, everyone! This is a demo about how to create a dynamic table of
      contents with ScrollSpy effect using Vue's
      <a href="https://vuejs.org/guide/extras/composition-api-faq.html">
        Composition API</a
      >and
      <a
        href="https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
        >Intersection Observer API</a
      >.
    </p>
    <p>Check out the source code <a href="https://github.com/ethan-lamwah/vue3-scroll-spy-toc">here</a>, enjoys!</p>
  </header>
  <main>
    <section>
      <!-- dynamic content here -->
      <article v-html="postContent" data-toc-content></article>
    </section>
    <aside>
      <section id="section-toc">
        <h2 style="padding-left: 40px">ON THIS PAGE</h2>
        <nav>
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
        </nav>
      </section>
    </aside>
  </main>
</template>
<style scoped>
header{
    margin: 3rem auto;
}
@media (min-width: 768px) {
  /** page layout **/
  main {
    display: grid;
    grid-template-columns: 1fr 20em;
    max-width: 100em;
    margin: 0 auto;
  }

  /* Sticky Navigation */
  #section-toc {
    position: sticky;
    top: 3rem;
    align-self: start;
  }
}

ul {
  list-style: none;
}
nav a.active {
  color: var(--color-text);
}
</style>
