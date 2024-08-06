import fs from "fs-extra";
import path from "path";
import { ApolloClient } from "@apollo/client";
import { DocumentNode } from "graphql";

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

async function fetchData() {
  if (!apolloClientInstance) {
    console.error("Apollo Client Instance is not available.");
    return;
  }

  try {
    console.log("Querying posts...");
    const { data } = await apolloClientInstance.query({
      query: POSTS_QUERY,
    });
    const posts = data.posts.nodes;

    // Save data to a JSON file in both public/data and dist/data
    const publicDataPath = path.join(__dirname, "../public", "data");
    const distDataPath = path.join(__dirname, "data");

    console.log(`Saving data to ${publicDataPath} and ${distDataPath}`);

    await fs.ensureDir(publicDataPath);
    await fs.writeJson(path.join(publicDataPath, "posts.json"), posts);

    await fs.ensureDir(distDataPath);
    await fs.writeJson(path.join(distDataPath, "posts.json"), posts);

    console.log("Data fetched and saved successfully");
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

fetchData();
