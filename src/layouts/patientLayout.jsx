import { useDisclosure } from '@mantine/hooks';
import { AppShell, Burger } from '@mantine/core';
import Header from '../components/header';
import Navbar from '../components/patient/navbar';


export default function DoctorLayout({ children }) {
    const [opened, { toggle }] = useDisclosure();

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
        >
        <AppShell.Header>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Header />
        </AppShell.Header>
  
        <AppShell.Navbar p="md">
          <Navbar />
        </AppShell.Navbar>
  
        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    );
  }
  