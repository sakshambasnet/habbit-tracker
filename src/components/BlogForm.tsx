
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "@/contexts/BlogContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title must not exceed 100 characters."
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  })
});

type BlogFormValues = z.infer<typeof formSchema>;

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addBlog, updateBlog, getBlogById } = useBlog();
  const isEditing = !!id && id !== 'new';

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: ""
    }
  });

  useEffect(() => {
    if (isEditing) {
      const blog = getBlogById(id);
      if (blog) {
        form.reset({
          title: blog.title,
          content: blog.content
        });
      } else {
        navigate("/blog");
      }
    }
  }, [id, isEditing, getBlogById]);

  const onSubmit = async (values: BlogFormValues) => {
    if (isEditing) {
      await updateBlog(id, values.title, values.content);
    } else {
      await addBlog(values.title, values.content);
    }
    navigate("/blog");
  };

  return (
    <div className="container mx-auto py-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/blog")}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft size={16} />
        Back to Journal
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Journal Entry" : "New Journal Entry"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Update your learning insights" 
              : "Document what you've learned today"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="What did you learn today?" {...field} />
                    </FormControl>
                    <FormDescription>
                      A concise title for your journal entry
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share the details of what you learned..." 
                        className="min-h-[200px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Write about what you learned, insights gained, and questions you still have
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Save size={16} />
                {isEditing ? "Update Entry" : "Save Entry"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogForm;
