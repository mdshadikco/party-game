import { ID, Models, Query } from 'appwrite';
import { databases } from '../appwrite';
import { permission } from 'process';


// Configuration - Replace with your actual values
const DATABASE_ID = process.env.NEXT_PUBLIC_DB_ID || "";
const USERS_COLLECTION_ID= "";
const POSTS_COLLECTION_ID = "";

// You can define types for your user and post documents if needed
type DocumentData = { [key: string]: any };

// ------------------------------
// User Collection Operations
// ------------------------------
export const userDB = {
  async create(userData: DocumentData): Promise<Models.Document> {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        userData
      );
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getById(userId: string): Promise<Models.Document> {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async update(userId: string, userData: DocumentData): Promise<Models.Document> {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        userData
      );
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async delete(userId: string): Promise<{}> {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId
      );
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async list(limit: number = 25, offset: number = 0): Promise<Models.DocumentList<Models.Document>> {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [
          Query.limit(limit),
          Query.offset(offset)
        ]
      );
    } catch (error) {
      console.error('Error listing users:', error);
      throw error;
    }
  }
};

// ------------------------------
// Post Collection Operations
// ------------------------------
export const postsDB = {
  async create(postData: DocumentData): Promise<Models.Document> {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        ID.unique(),
        postData
      );
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async getById(postId: string): Promise<Models.Document> {
    try {
      return await databases.getDocument(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        postId
      );
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  },

  async list(limit: number = 25): Promise<Models.DocumentList<Models.Document>> {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        POSTS_COLLECTION_ID,
        [Query.limit(limit)]
      );
    } catch (error) {
      console.error('Error listing posts:', error);
      throw error;
    }
  }
};

// ------------------------------
// Generic Collection Operations
// ------------------------------
export const db = {
  async create(
    collectionId: string,
    data: DocumentData,
    permission: any
  ): Promise<Models.Document> {
    try {
      return await databases.createDocument(
        DATABASE_ID,
        collectionId,
        ID.unique(),
        data,
        permission
      );
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  async get(collectionId: string, documentId: string): Promise<Models.Document> {
    console.log({collectionId, documentId, DATABASE_ID})
    try {
      return await databases.getDocument(
        DATABASE_ID,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  async update(
    collectionId: string,
    documentId: string,
    data: DocumentData
  ): Promise<Models.Document> {
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        collectionId,
        documentId,
        data
      );
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  },

  async delete(collectionId: string, documentId: string): Promise<{}> {
    try {
      return await databases.deleteDocument(
        DATABASE_ID,
        collectionId,
        documentId
      );
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  },

  async list(
    collectionId: string,
    queries: string[] = []
  ): Promise<Models.DocumentList<Models.Document>> {
    try {
      return await databases.listDocuments(
        DATABASE_ID,
        collectionId,
        queries
      );
    } catch (error) {
      console.error('Error listing documents:', error);
      throw error;
    }
  }
};
