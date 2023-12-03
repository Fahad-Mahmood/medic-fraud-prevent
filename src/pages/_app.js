import '@/styles/globals.css'
import "@mantine/core/styles.css";
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import Web5Provider from '@/providers/web5Provider';


const theme = createTheme({
  /* Put your mantine theme override here */
});



export default function App({ Component, pageProps }) {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <Web5Provider>
        <Component {...pageProps} />
      </Web5Provider>
    </MantineProvider>
  ) 
}
