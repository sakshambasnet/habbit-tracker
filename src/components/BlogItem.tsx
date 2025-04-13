
import { useBlog } from "@/contexts/BlogContext";
import { Blog } from "@/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface BlogItemProps {
  blog: Blog;
}

const BlogItem = ({ blog }: BlogItemProps) => {
  const { deleteBlog } = useBlog();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    }).format(date);
  };

  const handleDelete = async () => {
    await deleteBlog(blog.id);
    setDeleteDialogOpen(false);
  };

  // Truncate content for preview
  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-1">{blog.title}</CardTitle>
        <CardDescription>{formatDate(blog.createdAt)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="prose prose-sm">
          <p className="line-clamp-4">{truncateContent(blog.content)}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/blog/${blog.id}`)}>
          Read More
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(`/blog/edit/${blog.id}`)}
          >
            <Edit size={16} />
          </Button>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive">
                <Trash2 size={16} />
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
      </CardFooter>
    </Card>
  );
};

export default BlogItem;
