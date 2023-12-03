import Link from 'next/link';
import { Flex, NavLink } from '@mantine/core';
import { IconHome2, IconPill } from '@tabler/icons-react';


export default function Navbar() {
    return (
    <Flex    
      className='h-full w-full bgColor-red-100 mx-4'
      justify="flex-start"
      align="flex-start"
      direction="column"
      >
        <NavLink component={Link} href='/patient' label="Profile" leftSection={<IconHome2 size="1rem" stroke={1.5} />} />
        <NavLink component={Link} href='/patient/prescription' label="Prescriptions" leftSection={<IconPill size="1rem" stroke={1.5} />} />
    </Flex>
    );
  }
  