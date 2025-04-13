
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Blog } from "@/types";
import { 
  fetchUserBlogs, 
  createBlog, 
  updateBlogPost, 
  deleteBlogPost 
} from "@/services/blogService";

export const useBlogOperations = (userId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBlogs = async (): Promise<Blog[]> => {
    if (!userId) return [];
    
    try {
      setIsLoading(true);
      const blogs = await fetchUserBlogs(userId);
      return blogs;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load your blogs. Please try again.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addBlog = async (title: string, content: string): Promise<void> => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please login to create a blog post",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBlog(title, content, userId);
      toast({
        title: "Success!",
        description: "Your blog post has been created.",
      });
    } catch (error) {
      console.error("Error adding blog:", error);
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateBlog = async (id: string, title: string, content: string): Promise<void> => {
    if (!userId) return;

    try {
      await updateBlogPost(id, title, content, userId);
      toast({
        title: "Success!",
        description: "Your blog post has been updated.",
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteBlog = async (id: string): Promise<void> => {
    if (!userId) return;

    try {
      await deleteBlogPost(id, userId);
      toast({
        title: "Success!",
        description: "Your blog post has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    isLoading,
    setIsLoading,
    fetchBlogs,
    addBlog,
    updateBlog,
    deleteBlog
  };
};

export default useBlogOperations;
