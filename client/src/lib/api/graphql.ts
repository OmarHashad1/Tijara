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

const ALL_CATEGORIES_QUERY = gql`
  query AllCategories {
    allCategories {
      id
      name
      slug
      status
    }
  }
`;

/** Admin listing — includes DRAFT/SUSPENDED (the public query filters them). */
export async function fetchAllCategories(): Promise<Category[]> {
  const response = await gqlClient.request<{ allCategories: Category[] }>(
    ALL_CATEGORIES_QUERY,
  );
  return response.allCategories;
}

/* ---- Admin mutations (ROLE.ADMIN guarded server-side) ---- */

const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      status
    }
  }
`;

const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory($id: String!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      status
    }
  }
`;

const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($id: String!) {
    deleteCategory(id: $id)
  }
`;

export type CategoryStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED";

export async function createCategory(input: {
  name: string;
  status?: CategoryStatus;
}): Promise<Category> {
  const response = await gqlClient.request<{ createCategory: Category }>(
    CREATE_CATEGORY_MUTATION,
    { input },
  );
  return response.createCategory;
}

export async function updateCategory(input: {
  id: string;
  changes: { name?: string; status?: CategoryStatus };
}): Promise<Category> {
  const response = await gqlClient.request<{ updateCategory: Category }>(
    UPDATE_CATEGORY_MUTATION,
    { id: input.id, input: input.changes },
  );
  return response.updateCategory;
}

export async function deleteCategory(id: string): Promise<void> {
  await gqlClient.request(DELETE_CATEGORY_MUTATION, { id });
}
