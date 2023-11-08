import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
import Homepage from '@/components/Homepage';

export default function Home() {
  return (
   <>
   <Homepage/>
   </>
  )
}
