export const CONTRACT_ADDRESS = '0xf809B88459b66417300E6e70d34EbD669355c7Bb'

export const CONTRACT_ABI = [
    {
        "type": "function",
        "name": "greeting",
        "inputs": [],
        "outputs": [{ "name": "", "type": "string", "internalType": "string" }],
        "stateMutability": "view"
    },
    {
        "type": "function",
        "name": "setGreeting",
        "inputs": [{ "name": "_greeting", "type": "string", "internalType": "string" }],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
]
