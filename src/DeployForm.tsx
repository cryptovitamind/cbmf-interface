import { useCallback, useEffect, useState } from 'react';
import { TextField, Button, Paper, Box, Typography, Fade } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { injected } from './utils';
import { factoryAbi } from './contracts/FactoryAbi';

const DEAD_ADDR    = '0x000000000000000000000000000000000000dEaD'
const TARGET_ADDR  = '0x750EF1D7a0b4Ab1c97B7A623D7917CcEb5ea779C'
const FACTORY_ADDR = '0x3726737Cb21D04F08886e47A9234cA0A418407D7'
const POOL_ADDR    = '0x37E716DC8BAf95112eF7eab7Fc74d2a21283b3D7'
const TKN_ADDR     = '0xCbB1dbDBeDDe66D80083701ef087854A7729b60F'
const TKN_PRC_ADDR = '0xAa869d082D6f60B93735a97cDf16D3f0Ee864B9b'

interface DTextFieldProps {
    label: string
    stateValue: string
    setStateValue: React.Dispatch<React.SetStateAction<string>>
}

function DTextField(p: DTextFieldProps) {
    return (
        <TextField label={p.label} value={p.stateValue}
                   onChange={(e) => p.setStateValue(e.target.value)} fullWidth 
                   sx={{ input: {fontSize: 'small', fontFamily: 'monospace'}, paddingBottom: '10px' }} />
    )
}

function DeployForm() {
    const customShadow = '0px 0px 25px #000000';

    const [factory, setFactory] = useState(FACTORY_ADDR);
    const [dead, setDead] = useState(DEAD_ADDR);
    const [token, setToken] = useState(TKN_ADDR);
    const [target, setTarget] = useState(TARGET_ADDR);
    const [pool, setPool] = useState(POOL_ADDR);
    const [oc, setOC] = useState(DEAD_ADDR);
    const [tknPrc, setTknPrice] = useState(TKN_PRC_ADDR);
    const [deployedList, setDeployedList] = useState<string[]>([]);

    const [deploying, setDeploying] = useState(false);
    const { activate, active, error, deactivate, account, chainId, connector } = useWeb3React();

    const connectWallet = useCallback(() => {
        if(active === false) {
            activate(injected)
        }
        localStorage.setItem("Connected", "true")
    }, [active]);

    const disconnectWallet = () => {
        deactivate()
        localStorage.removeItem("Connected")
    };

    const getFactoryContract = async () => {
        const provider = new ethers.providers.Web3Provider(await connector?.getProvider())
        const signer = provider.getSigner();
    
        return new ethers.Contract(
            FACTORY_ADDR,
            factoryAbi,
            signer
        );
    }

    const deploy = async () => {
        console.log("Deploying...")
        const factoryContract: ethers.Contract = await getFactoryContract();
        //setDeploying(true)
        const tx = await factoryContract.create(dead, token, target, pool, oc, TKN_PRC_ADDR)
        await tx.wait()
           .then(() => {
                console.log("Deployed")
                setDeploying(false)
                updateDeployed()
           })
    }

    useEffect(() => {
        connectWallet()
    }, [])

    useEffect(() => {
        if(active === true) {
            updateDeployed()
        }
    }, [active])

    function DeployedList(props: {addresses: string[]}) {
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography style={{ margin: '10px 0'}} sx={{fontSize:'large', color: 'gray'}}>
                Previously Deployed Contracts
            </Typography>
            {props.addresses.map((stringItem, index) => (
              <Typography key={index} style={{ margin: '10px 0'}} sx={{fontSize:'small'}}>
                {stringItem}
              </Typography>
            ))}
          </div>
        );
    }

    const updateDeployed = async () => {
        console.log("Updating deployed contracts.")
        const factoryContract: ethers.Contract = await getFactoryContract();
        const contractsCreated: number = await factoryContract.count()
        
        for (let i = 0; i < contractsCreated; i++) {
            const addr = await factoryContract.created(i)
            setDeployedList(deployedList => Array.from(new Set([...deployedList, addr])))
        }

        console.log(contractsCreated)
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        >
            <Paper elevation={3} style={{
                padding: 20, minWidth: 300, maxWidth: 600, boxShadow: customShadow, borderRadius: 10
            }}>

                <Typography variant="h4" textAlign="center" color={'gray'} gutterBottom paddingBottom="10px">
                    Burn Mechanism Factory
                </Typography>
                <Typography variant="body1" textAlign="center" gutterBottom paddingBottom="20px">
                    Connected to: {account != undefined? (account.substring(0,7)) + '...': 'None'}{'  '}
                    <span style={{ color: 'gray' }}>(Chain id: { chainId ?? 'Not Connected'})</span>
                </Typography>
                 
                <Box display="flex" flexDirection="column" gap={2}>

                    <DTextField label="Factory Addr"         stateValue={factory} setStateValue={setFactory} />
                    <DTextField label="TokenPrice Addr"      stateValue={tknPrc}  setStateValue={setTknPrice} />
                    <DTextField label="Burn Addr"            stateValue={dead}    setStateValue={setDead} />
                    <DTextField label="Token Addr"           stateValue={token}   setStateValue={setToken} />
                    <DTextField label="Uniswap V3 Pool Addr" stateValue={pool}    setStateValue={setPool} />
                    <DTextField label="Off Chain 1 Addr"     stateValue={oc}      setStateValue={setOC} />
                    <DTextField label="Charity Target Addr"  stateValue={target}  setStateValue={setTarget} />

                    {/* --- Connect Wallet --- */}
                    <Button variant="contained" 
                        onClick={active? disconnectWallet : connectWallet} 
                        style={{ color: '#fffff0', marginTop: 8, background: '#4d3059' }} fullWidth>

                            {active? 'Disconnect': 'Connect Wallet'}
                    </Button>

                    {/* --- Deploy --- */}
                    <Fade in={active} timeout={{ enter: 1000, exit: 500 }}>
                        <Button variant="contained" onClick={() => deploy()} disabled={deploying}
                                style={{ color: '#fffff0', marginTop: 8, background: '#4d3059' }} fullWidth>
                            {deploying? 'Deploying' : 'Deploy'}
                        </Button>
                    </Fade>

                    {/* --- Error --- */}
                    <Fade in={error != undefined} >
                        <Typography color={'red'} variant="body1" textAlign="center" 
                                    gutterBottom paddingBottom="10px">
                            {error && error.message? error.message.replace('window.ethereum', 'your browser') : ''}
                        </Typography>
                    </Fade>

                    <DeployedList addresses={deployedList}/>
                </Box>
            </Paper>
        </Box>
    )
}

export default DeployForm;
