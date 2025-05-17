import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-8">
        <p>You need to be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage
            src={user.profileImage || 'https://via.placeholder.com/150'}
            alt={user.name || 'User'}
          />
          <AvatarFallback>
            {user.name ? user.name.charAt(0) : 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-bold">{user.name || 'Anonymous User'}</h2>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold">Wishlist</h3>
        <p className="text-muted-foreground">Wishlist feature coming soon.</p>
      </div>
    </div>
  );
}