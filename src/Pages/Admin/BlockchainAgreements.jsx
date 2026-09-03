
import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  Clock,
  ExternalLink,
  X,
  Eye,
  AlertTriangle,
  DollarSign,
  Loader,
} from "lucide-react"
import Web3 from "web3"
import { getAggrementForAdminByOwnerIDs, MakeAggrementForAdminByOwnerIDs } from "../../Api/Blockchain"

export default function BlockchainAgreements() {
  const [agreements, setAgreements] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedAgreement, setSelectedAgreement] = useState(null)
  const [currentAccount, setCurrentAccount] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentStatus, setDeploymentStatus] = useState({ success: false, hash: "", error: "" })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch agreements from API
  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        setIsLoading(true)
        const response = await getAggrementForAdminByOwnerIDs()
       
        // Transform the data to match our component's expected format
        const formattedAgreements = (Array.isArray(response?.data?.data) ? response.data.data : []).map((agreement) => ({
          id: agreement._id,
          title: `Agreement ${agreement._id.substring(0, 8)}...`,
          renter: agreement.renter?.name || "Unknown Renter",
          owner: agreement.owner?.name || "Unknown Owner",
          status: agreement.blockchainStatus ? "Deployed" : "Pending",
          deployDate: agreement.blockchainDeployDate || null,
          txHash: agreement.transactionHash || null,
          duration: agreement.duration || "Not specified",
          amount: agreement.amount ? `$${agreement.amount}` : "Not specified",
          terms: agreement.terms || "Standard rental agreement terms.",
          // Add any other fields you need
        }))

        setAgreements(formattedAgreements)
      } catch (error) {
        console.error("Error fetching agreements:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAgreements()
  }, [])

  // Check for MetaMask connection
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0])
          }
        } catch (error) {
          console.error("Error fetching accounts:", error)
        }
      }
    }

    checkWalletConnection()
  }, [])

  // Filter agreements based on search and status filter
  const filteredAgreements = agreements.filter(
    (agreement) =>
      (statusFilter === "All" || agreement.status === statusFilter) &&
      (agreement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.renter?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.owner?.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleViewAgreement = (agreement) => {
    setSelectedAgreement(agreement)
  }

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        setCurrentAccount(accounts[0])
        return accounts[0]
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
        return null
      }
    } else {
      alert("MetaMask is not installed. Please install it to use this feature.")
      return null
    }
  }

  const handleDeployAgreement = async (agreement) => {
    // Reset status
    setDeploymentStatus({ success: false, hash: "", error: "" })

    // Make sure we have a connected wallet
    let account = currentAccount
    if (!account) {
      account = await connectWallet()
      if (!account) return
    }

    setIsDeploying(true)

    try {
      // Initialize Web3
      const web3 = new Web3(window.ethereum)
      const contractAddress = "0xa9A58C79fE35a675577ACd9144643BbB63e7585C" // Your contract address
      const contractABI = [
        {
          inputs: [],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "string",
              name: "agreementId",
              type: "string",
            },
            {
              indexed: true,
              internalType: "address",
              name: "creator",
              type: "address",
            },
          ],
          name: "AgreementCreated",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "_agreementId",
              type: "string",
            },
          ],
          name: "createAgreement",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "agreementId",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "owner",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      ]

      const rentalContract = new web3.eth.Contract(contractABI, contractAddress)

      // Send transaction
      const tx = await rentalContract.methods.createAgreement(agreement.id).send({ from: account })

      // Update the agreement status in the database
      const updateResponse = await MakeAggrementForAdminByOwnerIDs({
        agreementId: agreement.id,
        transactionHash: tx.transactionHash,
      })

      // Update local state
      setDeploymentStatus({
        success: true,
        hash: tx.transactionHash,
        error: "",
      })

      // Update the agreements list
      setAgreements((prevAgreements) =>
        prevAgreements.map((a) =>
          a.id === agreement.id
            ? {
                ...a,
                status: "Deployed",
                txHash: tx.transactionHash,
                deployDate: new Date().toISOString().split("T")[0],
              }
            : a,
        ),
      )
    } catch (error) {
      console.error("Error deploying agreement:", error)
      setDeploymentStatus({
        success: false,
        hash: "",
        error: error.message || "Failed to deploy agreement",
      })
    } finally {
      setIsDeploying(false)
    }
  }

  return (
    <div className="space-y-6 mx-4 ">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search agreements..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <select
                className="appearance-none pl-10 pr-8 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Deployed">Deployed</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
              <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            {!currentAccount && (
              <button
                onClick={connectWallet}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Wallet Status */}
      {currentAccount && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-3">
              <User size={16} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Connected Wallet</p>
              <p className="text-sm font-medium truncate">{currentAccount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Loader size={24} className="text-orange-500 animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Loading agreements...</h3>
            <p className="text-gray-500">Please wait while we fetch your agreements</p>
          </div>
        </div>
      ) : (
        <>
          {/* Agreements Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgreements.map((agreement) => (
              <div
                key={agreement.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div
                  className={`h-2 ${
                    agreement.status === "Deployed"
                      ? "bg-green-500"
                      : agreement.status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <FileText size={24} className="text-orange-600" />
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        agreement.status === "Deployed"
                          ? "bg-green-100 text-green-800"
                          : agreement.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {agreement.status}
                    </span>
                  </div>
                  <div className="cursor-pointer" onClick={() => handleViewAgreement(agreement)}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{agreement.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={14} className="mr-2" />
                        <span className="truncate">Renter: {agreement.renter}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User size={14} className="mr-2" />
                        <span className="truncate">Owner: {agreement.owner}</span>
                      </div>
                      {agreement.deployDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={14} className="mr-2" />
                          <span>Deployed: {agreement.deployDate}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center text-gray-500">
                      <Clock size={14} className="mr-1" />
                      <span>{agreement.duration}</span>
                    </div>
                    <div className="font-medium text-orange-600">{agreement.amount}</div>
                  </div>

                  {/* Deploy Button */}
                  {agreement.status === "Pending" ? (
                    <button
                      onClick={() => handleDeployAgreement(agreement)}
                      disabled={!currentAccount || isDeploying}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {isDeploying ? (
                        <>
                          <Loader size={16} className="mr-2 animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <FileText size={16} className="mr-2" />
                          Deploy to Blockchain
                        </>
                      )}
                    </button>
                  ) : agreement.status === "Failed" ? (
                    <button
                      onClick={() => handleDeployAgreement(agreement)}
                      disabled={!currentAccount || isDeploying}
                      className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      <FileText size={16} className="mr-2" />
                      Retry Deployment
                    </button>
                  ) : (
                    <button
                      onClick={() => handleViewAgreement(agreement)}
                      className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    >
                      <Eye size={16} className="mr-2" />
                      View Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAgreements.length === 0 && !isLoading && (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <FileText size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No agreements found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Agreement Details Modal */}
      {selectedAgreement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Agreement Details</h3>
              <button onClick={() => setSelectedAgreement(null)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-2xl font-bold text-gray-900">{selectedAgreement.title}</h4>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    selectedAgreement.status === "Deployed"
                      ? "bg-green-100 text-green-800"
                      : selectedAgreement.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedAgreement.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Parties</h5>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <User size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Renter</p>
                        <p className="text-sm font-medium">{selectedAgreement.renter}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <User size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Owner</p>
                        <p className="text-sm font-medium">{selectedAgreement.owner}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Agreement Details</h5>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Clock size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm font-medium">{selectedAgreement.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <DollarSign size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-sm font-medium">{selectedAgreement.amount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-500 mb-2">Terms & Conditions</h5>
                <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">{selectedAgreement.terms}</div>
              </div>

              {selectedAgreement.status === "Deployed" && selectedAgreement.txHash && (
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-gray-500 mb-2">Blockchain Information</h5>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500">Transaction Hash</p>
                        <p className="text-sm font-medium truncate max-w-xs">{selectedAgreement.txHash}</p>
                      </div>
                      <a
                        href={`https://sepolia.etherscan.io/tx/${selectedAgreement.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 flex items-center"
                      >
                        <span className="text-sm mr-1">View on Etherscan</span>
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    {selectedAgreement.deployDate && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500">Deploy Date</p>
                        <p className="text-sm font-medium">{selectedAgreement.deployDate}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                {selectedAgreement.status === "Pending" && (
                  <button
                    onClick={() => {
                      setSelectedAgreement(null)
                      handleDeployAgreement(selectedAgreement)
                    }}
                    disabled={!currentAccount || isDeploying}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors mr-3 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isDeploying ? "Deploying..." : "Deploy to Blockchain"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedAgreement(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Status Modal */}
      {(deploymentStatus.success || deploymentStatus.error) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              {deploymentStatus.success ? (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-green-100 p-3 rounded-full">
                      <FileText size={24} className="text-green-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Deployment Successful</h3>
                  <p className="text-center text-gray-600 mb-4">
                    The agreement has been successfully deployed to the blockchain.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <p className="text-xs text-gray-500">Transaction Hash</p>
                    <p className="text-sm font-medium break-all">{deploymentStatus.hash}</p>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href={`https://sepolia.etherscan.io/tx/${deploymentStatus.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors mr-3 flex items-center"
                    >
                      <ExternalLink size={16} className="mr-2" />
                      View on Etherscan
                    </a>
                    <button
                      onClick={() => setDeploymentStatus({ success: false, hash: "", error: "" })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertTriangle size={24} className="text-red-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Deployment Failed</h3>
                  <p className="text-center text-gray-600 mb-4">
                    There was an error deploying the agreement to the blockchain.
                  </p>
                  <div className="bg-red-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-red-800">{deploymentStatus.error}</p>
                  </div>
                  <div className="flex justify-center">
                    <button
                      onClick={() => setDeploymentStatus({ success: false, hash: "", error: "" })}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
