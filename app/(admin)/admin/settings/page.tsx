import { getCurrentUser } from '@/app/lib/dal';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();

  return <SettingsClient user={{ id: currentUser.id, email: currentUser.email, name: currentUser.name }} />;
}