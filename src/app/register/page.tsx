import NavBar from '@/components/NavBar';
import RegisterForm from '@/components/RegisterForm';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const accessToken = (await cookies()).get('access_token')?.value;

  if (accessToken) {
    redirect('/');
  }
  return (
    <div className="w-full flex flex-col gap-[20px]">
      <NavBar />
      <RegisterForm />
    </div>
  );
}
