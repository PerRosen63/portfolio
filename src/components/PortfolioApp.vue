<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Post } from "../types";
import { Page } from "../types";

// Create refs for loading state, error state, and post data
const loading = ref(true);
const error = ref<string | null>(null);
const posts = ref<Post[]>([]);
const featuredPage = ref<Page | null>(null);

// Function to fetch data from posts.json
const fetchPostsAndFeaturedPage = async () => {
  try {
    const basePath = import.meta.env.BASE_URL;
    const postsResponse = await fetch(`${basePath}data/posts.json`);
    const featuredPageResponse = await fetch(`${basePath}data/page.json`);
    if (!postsResponse.ok || !featuredPageResponse.ok) {
      throw new Error(
        `HTTP error! status: ${postsResponse.status} ${featuredPageResponse.status}`
      );
    }

    posts.value = await postsResponse.json();
    featuredPage.value = await featuredPageResponse.json();

    loading.value = false;
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
      loading.value = false;
    }
  }
};

// Fetch the posts on component mount
onMounted(() => {
  fetchPostsAndFeaturedPage();
});
</script>

<template>
  <div v-if="error">
    <p>Something went wrong... {{ error }}</p>
  </div>
  <div v-if="loading">
    <p>Loading...</p>
  </div>

  <div v-else>
    <div class="presentation" v-if="featuredPage">
      <div v-html="featuredPage.content"></div>

      <img
        v-if="featuredPage.featuredImage"
        :src="featuredPage.featuredImage.node.sourceUrl"
        :width="featuredPage.featuredImage?.node.mediaDetails?.width || 100"
      />
    </div>
    <article v-for="post in posts" :key="post.id">
      <h2>
        <a :href="`/posts/${post.slug}`" :title="`Read ${post.title}`">{{
          post.title
        }}</a>
      </h2>
      <!-- Use v-html to render the HTML content -->
      <div v-html="post.content"></div>
    </article>
  </div>
</template>
