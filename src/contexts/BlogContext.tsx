import React, { createContext, useContext, useState, useEffect } from "react";
import { Blog } from "@/types";
import { useAuth } from "./AuthContext";
import useBlogOperations from "@/hooks/useBlogOperations";
import { subscribeToUserBlogs } from "@/services/blogService";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BlogDbMapping } from "@/types";
import { mapDbToModel } from "@/utils/blogMappers";

interface BlogContextType {
  blogs: Blog[];
  isLoading: boolean;
  addBlog: (title: string, content: string) => Promise<void>;
  updateBlog: (id: string, title: string, content: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  getBlogById: (id: string) => Blog | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("useBlog must be used within a BlogProvider");
  }
  return context;
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchBlogs = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Explicitly type data as BlogDbMapping[]
      setBlogs((data as BlogDbMapping[]).map(mapDbToModel));
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast({
        title: "Error",
        description: "Failed to load your blogs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('blogs-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchBlogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const addBlog = async (title: string, content: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a blog post",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from('blogs').insert({
        title,
        content,
        user_id: user.id,
      });

      if (error) throw error;

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

  const updateBlog = async (id: string, title: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .update({ 
          title, 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

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

  const deleteBlog = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

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

  const getBlogById = (id: string) => {
    return blogs.find(blog => blog.id === id);
  };

  return (
    <BlogContext.Provider
      value={{
        blogs,
        isLoading,
        addBlog,
        updateBlog,
        deleteBlog,
        getBlogById
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
