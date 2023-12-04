import { useRouter } from 'next/router';
import { Button } from '@mantine/core';
import Header from '@/components/header';
export default function Home() {
const router = useRouter();

  return (
    <div className='bg-slate-200 p-2'>
    <Header />
    <div className="app-container w-screen h-screen  flex flex-row justify-center items-center">
      <Button onClick={() => router.push('/doctor')}>I'm a Doctor</Button>
      <Button className='ml-12' onClick={() => router.push('/patient')}>I'm a Patient</Button>
    </div>
    </div>
  );
}