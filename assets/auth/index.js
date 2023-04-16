import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const showAccount = document.getElementById('showAccount')
const purchaseButton = document.getElementById('purchaseButton')
const status = document.getElementById('status')
const bnbInput = document.getElementById('bnbInput')
const novisInput = document.getElementById('novisInput')
const BNB_TO_NOVIS_RATE = 10000

connectButton.onclick = connect;
purchaseButton.onclick = purchaseTokens;

bnbInput.addEventListener('input', (event) => {
  const bnbAmount = parseFloat(event.target.value);
  if (isNaN(bnbAmount)) {
    novisInput.value = '';
  } else {
    const novisAmount = bnbAmount * BNB_TO_NOVIS_RATE;
    novisInput.value = novisAmount.toFixed(2);
  }
});




async function connect() {
  const connectButton = document.getElementById("connectButton")
  const purchaseButton = document.getElementById("purchaseButton")
  const showAccount = document.getElementById("showAccount")

  if (typeof window.ethereum !== 'undefined') {
    let provider = window.ethereum

    try {
      const chainId = await provider.request({
        method: 'eth_chainId'
      })

      console.log('This is Chain ID: ', chainId)

      if (chainId === '0x38' || chainId === '0x61') {
        await ethereum.request({ method: 'eth_requestAccounts' })

        tokensSold()
        progress()
        rate()
        connectButton.innerHTML = "Connected"
        connectButton.style.backgroundColor = "#00FF00"
        purchaseButton.style.display = "block"

        const accounts = await ethereum.request({ method: "eth_accounts" })
        console.log(accounts)
        showAccount.innerHTML = accounts
        setStatus(true)
      } else {
        connectButton.innerHTML = "Switch to BSC testnet"
        connectButton.onclick = () => {
          ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x38',
              chainName: 'Binance Smart Chain Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/']
            }]
          })
        }
      }
    } catch (error) {
      console.log(error)
      alert("Network error. Please check your MetaMask network settings.")
    }
  } else {
    connectButton.innerHTML = "Please install MetaMask"
    setStatus(false)
  }
}



async function purchaseTokens() {
  const amount = document.getElementById("bnbInput").value
  if (amount >= 0.001) {
    console.log(`Funding with ${amount}...`)
    alert("Please wait for wallet confirmation")
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      try {
        const transactionResponse = await contract.buyTokens({
          value: ethers.utils.parseEther(amount),
          gasLimit: 500000,
        })
        await listenForTransactionMine(transactionResponse, provider)
        console.log("Done")
        alert("Tokens Bought!")
      } catch (error) {
        console.log(error)
      }
    } else {
      purchaseButton.innerHTML = "Please install MetaMask"
    } 
  } else {
    alert("Enter amount more than 0.001 BNB!")
  }
}

async function progress() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const BNBearned = await contract.progress()
      const progressDiv = document.getElementById('progress');
      progressDiv.innerText = ethers.utils.formatUnits(BNBearned);
      updateProgressBar();
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    purchaseButton.innerHTML = "Please install MetaMask"
  } 
}

async function updateProgressBar() {
  const progressBarRect = document.getElementById('progressBarRect');
  const progressBarContainer = document.querySelector('.section2__progressBarContainer');
  const progressBarWidth = progressBarContainer.offsetWidth - 4;
  const progressDiv = document.getElementById('progress');
  const BNBearned = parseFloat(progressDiv.innerText.replace(',', ''));
  const BNBstart = 0;
  const BNBend = 50;
  const progress = Math.max(0, Math.min((BNBearned - BNBstart) / (BNBend - BNBstart), 1));
  progressBarRect.style.width = progress * progressBarWidth + 'px';
}



async function tokensSold() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const totalSold = await contract.soldTokens()
      const tokensSoldDiv = document.getElementById('tokens-sold');
      tokensSoldDiv.innerText = ethers.utils.formatUnits(totalSold) * 10 ** 9;
    } catch (error) {
      console.log(error)
      alert(error.message)
    }
  } else {
    const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/your-project-id")
    const contract = new ethers.Contract(contractAddress, abi, provider)
    const totalSold = await contract.soldTokens()
    const tokensSoldDiv = document.getElementById('tokens-sold');
    tokensSoldDiv.innerText = ethers.utils.formatUnits(totalSold) * 10 ** 9;
  }
}


async function rate() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const rate = await contract.getRate()
      return ethers.utils.formatUnits(rate) * 10 ** 18;
    } catch (error) {
      throw new Error(error.message);
    }
  } else {
    throw new Error("Please install MetaMask");
  } 
}

async function listenForTransactionMine(transactionResponse, provider) {
  const receipt = await provider.waitForTransaction(transactionResponse.hash)
  console.log(receipt)
  return receipt
}

function setStatus(statusValue) {
  if (statusValue) {
    status.style.color = "green"
  } else {
    status.style.color = "red"
  }
}

