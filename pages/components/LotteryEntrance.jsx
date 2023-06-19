import { useEffect, useState } from "react"
import { contractAbiJson, contractAddressesJson } from "./../../constants"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { Button, useNotification } from "web3uikit"
import PageLoader from "next/dist/client/page-loader"
import Spinner from "./Spinner"

export default function LotteryEntrance(){

    const { isWeb3Enabled, account, chainId: chainIdHex } = useMoralis()
    const dispatch = useNotification()
    
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddressesJson ? contractAddressesJson[chainId] : null

    const [ entranceFee, setEntranceFee ] = useState(0);
    const [ numberOfPlayers, setNumberOfPlayers ] = useState(0);
    const [ recentWinner, setRecentWinner ] = useState(0);

    const weiToEth = (wei) => { return ethers.utils.formatUnits(wei) }

    const {runContractFunction: enterRaffle, isLoading, isFetching} = useWeb3Contract({
        abi: contractAbiJson,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: contractAbiJson,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {}
    })

    const {runContractFunction: getNumberOfPlayers} = useWeb3Contract({
        abi: contractAbiJson,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {}
    })

    const {runContractFunction: getRecentWinner} = useWeb3Contract({
        abi: contractAbiJson,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {}
    })

    const handleSuccessEnterRaffle = async (tx) => {
        await tx.wait(1)

        setNumberOfPlayers(parseInt(numberOfPlayers) + 1)
        handleNewNotification()
    }
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete",
            title: "TXN notificaiton",
            position: "topR",
            icon: "bell"
        })
    }
    
    useEffect(()=>{
        if (isWeb3Enabled) {
            async function updateUI(){
                setEntranceFee((await getEntranceFee()).toString())
                setNumberOfPlayers((await getNumberOfPlayers()).toString())
                setRecentWinner((await getRecentWinner()).toString())
            }
            updateUI()
        }
    }, [isWeb3Enabled])
    
    return (
            <>
                {
                isWeb3Enabled && account && raffleAddress &&
                <>
                    <div>
                        Hi from Lottery Entrance <br/>
                        Entrance Fee: {weiToEth(entranceFee)} ETH <br/>
                        Number of Players: {numberOfPlayers}<br/>
                        Recent Winner: {recentWinner}<br/>
                    </div>
        
                    <Button
                        text="Enter Raffle"
                        onClick={async ()=> await enterRaffle({
                            onSuccess: handleSuccessEnterRaffle,
                            onError: (err) => console.error(err)
                        })}
                        disabled={isLoading || isFetching}
                    />
                    {
                        (isLoading || isFetching) &&
                            <Spinner/>
                    }
                </>
                }
            </>
        
    )
}