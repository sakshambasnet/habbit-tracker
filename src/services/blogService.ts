
import { supabase } from "@/integrations/supabase/client";
import { Blog, BlogDbMapping } from "@/types";
import { mapDbToModel } from "@/utils/blogMappers";

/**
 * Fetches blogs for a specific user
 */
export const fetchUserBlogs = async (userId: string): Promise<Blog[]> => {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data as BlogDbMapping[]).map(mapDbToModel);
};

/**
 * Creates a new blog post
 */
export const createBlog = async (title: string, content: string, userId: string): Promise<void> => {
  const { error } = await supabase.from('blogs').insert({
    title,
    content,
    user_id: userId,
  });

  if (error) throw error;
};

/**
 * Updates an existing blog post
 */
export const updateBlogPost = async (id: string, title: string, content: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('blogs')
    .update({ 
      title, 
      content, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

/**
 * Deletes a blog post
 */
export const deleteBlogPost = async (id: string, userId: string): Promise<void> => {
  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
};

/**
 * Subscribe to real-time changes for a user's blogs
 */
export const subscribeToUserBlogs = (userId: string, callback: () => void) => {
  const channel = supabase
    .channel('blogs-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'blogs',
        filter: `user_id=eq.${userId}`
      },
      () => {
        callback();
      }
    )
    .subscribe();

  return channel;
};
