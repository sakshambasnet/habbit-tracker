
import Header from "@/components/Header";
import BlogList from "@/components/BlogList";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <BlogList />
      </main>
      
      <footer className="py-4 px-6 border-t border-border text-center text-sm text-muted-foreground">
        <p>© 2025 SassyStreak. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Blog;
