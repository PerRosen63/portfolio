import { createApp, provide, h } from "vue";
import { DefaultApolloClient } from "@vue/apollo-composable";
import App from "./App.vue";
import { apolloClientInstance } from "./apollo-client-node";

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClientInstance);
  },
  render: () => h(App),
});

app.mount("#app");
