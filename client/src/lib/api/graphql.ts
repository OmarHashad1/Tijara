import { GraphQLClient, gql } from "graphql-request";
import { API_BASE_URL } from "./client";
import type { Category } from "./types";

/**
 * Categories are GraphQL-only (the REST CRUD routes were removed).
 * A thin graphql-request client keeps the bundle small vs. Apollo.
 */
export const gqlClient = new GraphQLClient(`${API_BASE_URL}/graphql`, {
  credentials: "include",
  mode: "cors",
});

const CATEGORIES_QUERY = gql`
  query Categories {
    categories {
      id
      name
      slug
      status
    }
  }
`;

export async function fetchCategories(): Promise<Category[]> {
  const response = await gqlClient.request<{ categories: Category[] }>(
    CATEGORIES_QUERY,
  );
  return response.categories;
}
