import { Flex, Title } from '@mantine/core';
import { Cormorant_Garamond } from 'next/font/google'
 
const cormorant_garamond = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: '700',
  variable: '--font-caromorant-garamond',
})

export default function Header() {
    return (
    <Flex    
      className='h-full w-full bgColor-red-100 mx-4'
      justify="flex-start"
      align="center"
      >
       <Title className={`tracking-wider ${cormorant_garamond.variable}`} order={1} size='h4'>MedWeb5</Title>
    </Flex>
    );
  }
  