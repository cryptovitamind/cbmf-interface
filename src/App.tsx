import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DeployForm from './DeployForm';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers';

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  return library
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#221527',
    }
  },
});

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
          <DeployForm />
      </ThemeProvider>
    </Web3ReactProvider>
  );
}
