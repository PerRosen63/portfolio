<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Post } from '../types';

// Create refs for loading state, error state, and post data
const loading = ref(true)
const error = ref<string | null>(null);
const posts = ref<Post[]>([]);

// Function to fetch data from posts.json
const fetchPosts = async () => {
  try {
    const basePath = import.meta.env.BASE_URL;
    const response = await fetch(`${basePath}data/posts.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data: Post[]  = await response.json()
    posts.value = data
    loading.value = false
  } catch (err) {
    if (err instanceof Error) {
    error.value = err.message
    loading.value = false
    }
  }
}

// Fetch the posts on component mount
onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div v-if="error">
    <p>Something went wrong... {{ error }}</p>
  </div>
  <div v-if="loading">
    <p>Loading...</p>
  </div>
  <div v-else>
    <article v-for="post in posts" :key="post.id">
      <h2>
        <a :href="`/posts/${post.slug}`" :title="`Read ${post.title}`">{{ post.title }}</a>
      </h2>
      <!-- Use v-html to render the HTML content -->
      <div v-html="post.content"></div>
    </article>
  </div>
</template>
