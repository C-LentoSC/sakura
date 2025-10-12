import { redirect } from 'next/navigation';
import { verifySession } from '@/app/lib/dal';
import {
  BackgroundPattern,
  CherryBlossomTrees,
  FallingPetals,
  Header,
  Footer,
  Chatbot,
} from '../components';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const { isAuth } = await verifySession();

  if (!isAuth) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      <BackgroundPattern />
      <CherryBlossomTrees />
      <FallingPetals />
      <Header />
      <Chatbot />
      <div className="absolute inset-0 bg-pink-100/20 backdrop-blur-xs pointer-events-none z-0" />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

