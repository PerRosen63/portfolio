import fs from "fs-extra";
import path from "path";
import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";

import axios from "axios"; // Add axios for HTTP requests

console.log("Running fetchData.ts...");
console.log("Current directory contents:", fs.readdirSync(__dirname));

const expectedPath = path.join(__dirname, "apollo-client-node.cjs");
console.log("Expected path of apollo-client-node.cjs:", expectedPath);

let apolloClientInstance: ApolloClient<any> | null = null;
let gql: (
  literals: TemplateStringsArray,
  ...placeholders: any[]
) => DocumentNode = () => {
  throw new Error("gql is not assigned");
};

try {
  const apolloModule = require(expectedPath);
  apolloClientInstance = apolloModule.apolloClientInstance;
  gql = apolloModule.gql;
  console.log("Apollo Client Instance:", apolloClientInstance);
  console.log("GQL:", gql);
} catch (error) {
  console.error("Error requiring apollo-client-node:", error);
  process.exit(1); // Exit the script if the module cannot be required
}

const POSTS_QUERY = gql`
  query {
    posts {
      nodes {
        id
        databaseId
        title
        slug
        content
        years {
          startYear
        }
      }
    }
  }
`;

const PAGE_QUERY = gql`
  query GetPage {
    page(id: "14", idType: DATABASE_ID) {
      content
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

async function fetchData() {
  if (!apolloClientInstance) {
    console.error("Apollo Client Instance is not available.");
    return;
  }

  try {
    console.log("Querying posts...");
    const { data: postsData } = await apolloClientInstance.query({
      query: POSTS_QUERY,
    });
    const posts = postsData.posts.nodes;

    // Fetch the specific page
    console.log("Querying page...");
    const { data: pageData } = await apolloClientInstance.query({
      query: PAGE_QUERY,
    });
    const page = pageData.page;

    // Download the featured image and update the URL
    if (page && page.featuredImage && page.featuredImage.node.sourceUrl) {
      const imageUrl = page.featuredImage.node.sourceUrl;
      const imageResponse = await axios({
        url: imageUrl,
        responseType: "arraybuffer",
      });

      const imageName = path.basename(imageUrl);
      const distImagePath = path.join(__dirname, "data/images", imageName);
      const publicImagePath = path.join(
        __dirname,
        "../public/data/images",
        imageName
      );

      // Ensure the images directory exists in both dist and public
      await fs.ensureDir(path.join(__dirname, "data/images"));
      await fs.ensureDir(path.join(__dirname, "../public/data/images"));

      // Save the image to both locations
      await fs.writeFile(distImagePath, imageResponse.data);
      await fs.writeFile(publicImagePath, imageResponse.data);
      console.log(
        `Image downloaded and saved to ${distImagePath} and ${publicImagePath}`
      );

      const isProduction = process.env.NODE_ENV === "production";

      // Set the base URL depending on the environment
      const basePath = isProduction ? "/portfolio" : "";

      // Create a new page object with the updated sourceUrl
      const updatedPage = {
        ...page,
        featuredImage: {
          ...page.featuredImage,
          node: {
            ...page.featuredImage.node,
            // Use different paths for production and development
            sourceUrl: `${basePath}/data/images/${imageName}`,
          },
        },
      };

      // Save data to JSON files
      const publicDataPath = path.join(__dirname, "../public", "data");
      const distDataPath = path.join(__dirname, "data");

      console.log(`Saving data to ${publicDataPath} and ${distDataPath}`);

      await fs.ensureDir(publicDataPath);
      await fs.writeJson(path.join(publicDataPath, "posts.json"), posts);
      await fs.writeJson(path.join(publicDataPath, "page.json"), updatedPage);

      await fs.ensureDir(distDataPath);
      await fs.writeJson(path.join(distDataPath, "posts.json"), posts);
      await fs.writeJson(path.join(distDataPath, "page.json"), updatedPage);
    }

    console.log("Data fetched and saved successfully");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
