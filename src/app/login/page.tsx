import LoginForm from '@/components/LoginForm';
import NavBar from '@/components/NavBar';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const accessToken = (await cookies()).get('access_token')?.value;

  console.log(accessToken);

  if (accessToken) {
    redirect('/');
  }

  return (
    <div className="w-screen h-screen overflow-x-hidden">
      <NavBar />
      <LoginForm />
    </div>
  );
}
