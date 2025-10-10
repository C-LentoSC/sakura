import {
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Header,
} from '../components';
import { redirect } from 'next/navigation';
import { verifySession } from '../lib/dal';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session status with database verification
  const { isAuth } = await verifySession();
  
  if (isAuth) {
    // User is authenticated - redirect to homepage
    redirect('/');
  }
  
  // If not authenticated, the verifySession already checked DB
  // If user was deleted, they won't be authenticated
  // The middleware will handle clearing cookies on the next request

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}

