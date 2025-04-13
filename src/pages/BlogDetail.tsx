
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBlog } from "@/contexts/BlogContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBlogById, deleteBlog } = useBlog();
  const [blog, setBlog] = useState(id ? getBlogById(id) : undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const blogData = getBlogById(id);
      if (blogData) {
        setBlog(blogData);
      } else {
        navigate("/blog");
      }
    }
  }, [id, getBlogById, navigate]);

  const formatDate = (date?: Date) => {
    if (!date) return "";
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    }).format(date);
  };

  const handleDelete = async () => {
    if (!id) return;
    await deleteBlog(id);
    navigate("/blog");
  };

  if (!blog) {
    return null; // Or a loading state
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-6 px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/blog")}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Journal
        </Button>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl">{blog.title}</CardTitle>
                <CardDescription className="mt-2">
                  {formatDate(blog.createdAt)}
                  {blog.updatedAt && blog.updatedAt.getTime() !== blog.createdAt.getTime() && 
                    ` • Updated ${formatDate(blog.updatedAt)}`}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/blog/edit/${blog.id}`)}
                  className="flex items-center gap-1"
                >
                  <Edit size={14} />
                  Edit
                </Button>
                <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive border-destructive flex items-center gap-1"
                    >
                      <Trash2 size={14} />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Blog Post</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete "{blog.title}"? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none">
              {blog.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="py-4 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 SassyStreak. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BlogDetail;
