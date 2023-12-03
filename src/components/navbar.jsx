import Link from 'next/link';
import { Flex, NavLink } from '@mantine/core';
import { IconHome2, IconPill, IconBuildingHospital } from '@tabler/icons-react';


export default function Navbar() {
    return (
    <Flex    
      className='h-full w-full bgColor-red-100 mx-4'
      justify="flex-start"
      align="flex-start"
      direction="column"
      >
        <NavLink component={Link} href='/doctor' label="Profile" leftSection={<IconHome2 size="1rem" stroke={1.5} />} />
        <NavLink component={Link} href='/doctor/prescription' label="Prescriptions" leftSection={<IconPill size="1rem" stroke={1.5} />} />
        <NavLink component={Link} href='/doctor/patient' label="Patients" leftSection={<IconBuildingHospital size="1rem" stroke={1.5} />} />
    </Flex>
    );
  }
  