
import { useBlog } from "@/contexts/BlogContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Book } from "lucide-react";
import BlogItem from "./BlogItem";

const BlogList = () => {
  const { blogs, isLoading } = useBlog();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center gap-2">
            <Book className="h-8 w-8 text-primary" />
            Learning Journal
          </h1>
          <p className="text-muted-foreground mt-1">Document your learning journey and insights</p>
        </div>
        <Button onClick={() => navigate("/blog/new")} className="flex items-center gap-2">
          <Plus size={16} />
          New Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded-md w-3/4"></div>
                <div className="h-4 bg-muted rounded-md w-1/2 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-24 bg-muted rounded-md"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <Card className="border-dashed border-2 p-6">
          <div className="text-center">
            <Book className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
            <h3 className="text-xl font-medium mb-2">No journal entries yet</h3>
            <p className="text-muted-foreground mb-4">
              Start documenting what you've learned on your journey
            </p>
            <Button onClick={() => navigate("/blog/new")}>Create your first entry</Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogItem key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
