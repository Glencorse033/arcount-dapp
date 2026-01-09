import React, { useState, useEffect } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from './constants'
import { Wallet, LogOut, Send, RefreshCw, Globe } from 'lucide-react'

function App() {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [newGreeting, setNewGreeting] = useState('')

  // Read current greeting
  const {
    data: greeting,
    isLoading: isReadLoading,
    refetch
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'greeting',
  })

  // Write new greeting
  const {
    data: hash,
    error,
    isPending,
    writeContract,
    reset
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash })

  const handleUpdate = () => {
    if (!newGreeting) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'setGreeting',
      args: [newGreeting],
    })
  }

  useEffect(() => {
    if (isConfirmed) {
      refetch()
      setNewGreeting('')
      // Reset mutation state after 4 seconds to clear success message and hash
      const timer = setTimeout(() => reset(), 4000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed, refetch, reset])

  return (
    <div className="container">
      <div className="glass-card">
        <div className="status-badge">
          <Globe size={16} /> Arc Testnet Powered
        </div>

        <h1 className="title">Arcount</h1>
        <p className="subtitle">The simplest dApp on the world's most programmable financial layer.</p>

        {!isConnected ? (
          <div className="input-group">
            {connectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => connect({ connector })}
                className="btn"
              >
                <Wallet size={20} /> Connect {connector.name}
              </button>
            ))}
          </div>
        ) : (
          <div className="input-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span className="address-pill">
                {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <button onClick={() => disconnect()} className="btn" style={{ width: 'auto', padding: '0.4rem 0.8rem', background: '#334155' }}>
                <LogOut size={16} /> Disconnect
              </button>
            </div>

            <div className="greeting-display">
              {isReadLoading ? (
                <div className="loader" style={{ margin: '0 auto' }} />
              ) : (
                greeting || 'No data'
              )}
            </div>

            <div className="input-group">
              <input
                type="text"
                className="input"
                placeholder="Type a new greeting..."
                value={newGreeting}
                onChange={(e) => setNewGreeting(e.target.value)}
              />
              <button
                onClick={handleUpdate}
                className="btn"
                disabled={isPending || isConfirming || !newGreeting}
              >
                {(isPending || isConfirming) ? (
                  <RefreshCw className="loader" size={20} />
                ) : (
                  <><Send size={20} /> Update Greeting</>
                )}
              </button>
            </div>

            {isConfirmed && <p className="success-msg">Greeting updated successfully!</p>}
            {error && <p className="error-msg">Error: {error.shortMessage || error.message}</p>}
            {hash && !isConfirmed && (
              <p style={{ fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem', color: '#94a3b8' }}>
                Transaction Hash: <a href={`https://testnet.arcscan.app/tx/${hash}`} target="_blank" rel="noreferrer" style={{ color: '#6366f1' }}>{hash.slice(0, 10)}...</a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
