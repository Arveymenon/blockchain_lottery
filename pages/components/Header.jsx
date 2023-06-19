import { ConnectButton } from "web3uikit";

export default function Header () {

    return (
        <div className="p-5 border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3">Lottery</h1>
            <ConnectButton >Connect</ConnectButton>
        </div>
    )
}