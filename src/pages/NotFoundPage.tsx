import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/stores/authStore';

function NotFoundPage() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 user-select-none">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-4">🤔</div>
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          This page got lost in the chat
        </h2>
        <p className="text-muted-foreground mb-6">
          Looks like this page went offline. Let's get you back to where you belong.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isAuthenticated ? (
            <>
              <Button asChild>
                <Link to="/chat">Back to Chat</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/">Home</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;