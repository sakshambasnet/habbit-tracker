
import { Blog, BlogDbMapping } from "@/types";

/**
 * Maps database blog data to our application model
 */
export const mapDbToModel = (blogData: BlogDbMapping): Blog => {
  return {
    id: blogData.id,
    title: blogData.title,
    content: blogData.content,
    createdAt: new Date(blogData.created_at),
    updatedAt: new Date(blogData.updated_at),
    userId: blogData.user_id
  };
};
