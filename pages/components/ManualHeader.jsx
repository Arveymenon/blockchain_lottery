import { useEffect } from "react"

const { useMoralis } = require("react-moralis")


export default function Header () {
    const { enableWeb3, isWeb3Enabled, account, deactivateWeb3, Moralis, isWeb3EnableLoading } = useMoralis()

    useEffect(() => {
        if(isWeb3Enabled) return
        if(window.localStorage.getItem("connected"))
            enableWeb3()
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account)=> {
            if(!account){
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("No account found")
            }
        })
    }, [])

    return (
        <>
            {/* {
                account ? <div>web3 connected to account: {account}</div> : 
                
            } */}
            {isWeb3Enabled && account ? <div>web3 connected to account: {account.slice(0,6)}...{account.slice(account.length-4,account.length)} </div> :
                 <button onClick={async ()=> {
                     if(typeof window === "undefined")
                        return
                     await enableWeb3()
                     window.localStorage.setItem("connected", true)
                     
                    }} disabled={isWeb3EnableLoading}>Connect Wallet</button>
            }
        </>
    )

}