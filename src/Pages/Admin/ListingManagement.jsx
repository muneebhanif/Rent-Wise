import { useState, useEffect } from "react"
import { Search, Filter, Eye, Trash2, Calendar, DollarSign, User, Tag, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react"
import { deleteListing, getAllLists } from "../../Api/Admin"
import { Flex, useToast } from "@chakra-ui/react"
import ColorTubeLoader from "../../components/Style/ColorTubeLoader"




const ListingManagement = ({ categoryFilter = "All" }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedListing, setSelectedListing] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [filteredListings, setFilteredListings] = useState([])
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const listingsPerPage = 9
  const toast = useToast()

  useEffect(()=>{
      const getAllListings = async () => {
        try {
          const response = await getAllLists();
          if (response && response.data && response.data.data && response.data.data.allLists) {
            setListings(response.data.data.allLists)
            setFilteredListings(response.data.data.allLists)
            setLoading(false)
          } else {
            setListings([])
            setFilteredListings([])
          }
        } catch (error) {
          console.error("Failed to fetch listings:", error)
          setListings([])
          setFilteredListings([])
        }
      }
      getAllListings();

  },[])

  useEffect(() => {
    setCurrentPage(1)
    setFilteredListings(
      listings.filter(
        (listing) =>
          (categoryFilter === "All" || listing.category === categoryFilter) &&
          (statusFilter === "All" || listing.listingStatus === statusFilter) &&
          (listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (typeof listing.owner === "string" && listing.owner.toLowerCase().includes(searchTerm.toLowerCase())) ||
            listing.location?.toLowerCase().includes(searchTerm.toLowerCase())),
      ),
    )
  }, [searchTerm, statusFilter, categoryFilter, listings])

  const handleViewListing = (listing) => {
    setSelectedListing(listing)
  }

  const handleDeleteListing = (listing) => {
    setSelectedListing(listing)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    
    try {
      const response = await deleteListing(selectedListing._id);
      toast({
        title: "Listing deleted successfully",
        description: "Listing has been deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      toast({
        title: "Error while Deleting",
        description: error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      
    }
    
    
    setShowDeleteModal(false)
    setSelectedListing(null)
  }

  const indexOfLastListing = currentPage * listingsPerPage
  const indexOfFirstListing = indexOfLastListing - listingsPerPage
  const currentListings = filteredListings.slice(indexOfFirstListing, indexOfLastListing)
  const totalPages = Math.ceil(filteredListings.length / listingsPerPage)

  const goToPage = (pageNumber) => {
    if(pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
  }

    if (loading) {
                  return (
                    <Flex justify="center" align="center" height="100vh">
                      <ColorTubeLoader/>
                    </Flex>
                  );
                } 

  return (
    <div className="space-y-6 mx-4 ">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search listings..."
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
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <Filter size={16} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentListings.map((listing) => (
          <div
            key={listing?._id}
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <img 
                src={`${import.meta.env.VITE_BACK_END_URL}${listing?.images[0]?.url}` || "/placeholder.svg"} 
                alt={listing?.title} 
                className="object-cover w-full h-full" 
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    listing?.listingStatus === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {listing?.listingStatus}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    listing?.category === "House"
                      ? "bg-blue-100 text-blue-800"
                      : listing?.category === "Car"
                        ? "bg-green-100 text-green-800"
                        : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {listing?.category}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">{listing?.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MapPin size={14} className="mr-1" />
                <span className="truncate">{listing?.location}</span>
              </div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm font-medium text-gray-900">
                  <DollarSign size={16} className="text-orange-500 mr-1" />
                  {listing?.price}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <User size={14} className="mr-1" />
                  {typeof listing.owner === "string" ? listing.owner : listing.owner?.name || ""}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{listing?.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                  <Calendar size={14} className="inline mr-1" />
                  {listing?.createdAt}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewListing(listing)}
                    className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteListing(listing)}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Listing"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredListings.length > listingsPerPage && (
        <div className="flex justify-center items-center space-x-4 mt-6 ">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Previous Page"
          >
            <ChevronLeft size={20} />
          </button>
          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 rounded-md border ${currentPage === pageNum ? "bg-orange-500 text-white border-orange-500" : "border-gray-300 hover:bg-gray-100"}`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors ${currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label="Next Page"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {filteredListings.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No listings found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}

      {/* Listing Details Modal */}
      {selectedListing && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden">
            <div className="relative h-48">
              <img
                src={`${import.meta.env.VITE_BACK_END_URL}${selectedListing?.images[0]?.url}` || "/placeholder.svg"}
                alt={selectedListing.title}
                className="object-cover w-full h-full"
              />
              <button
                onClick={() => setSelectedListing(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-1 shadow hover:bg-gray-100"
              >
                <X size={18} className="text-gray-600" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                <h3 className="text-2xl font-bold text-white">{selectedListing.title}</h3>
                <div className="flex items-center text-white mt-2">
                  <MapPin size={16} className="mr-1" />
                  <span>{selectedListing.location}</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
                  <Tag size={18} className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium">{selectedListing.category}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
                  <User size={18} className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Owner</p>
                    <p className="text-sm font-medium">{typeof selectedListing.owner === "string" ? selectedListing.owner : selectedListing.owner?.name || ""}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
                  <DollarSign size={18} className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Price</p>
                    <p className="text-sm font-medium">{selectedListing.price}</p>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center">
                  <Calendar size={18} className="text-gray-600 mr-2" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium">{selectedListing.createdAt}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedListing.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Total Views</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedListing.views}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">Inquiries</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedListing.inquiries}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleDeleteListing(selectedListing)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 size={24} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-gray-900 mb-2">Delete Listing</h3>
              <p className="text-center text-gray-600 mb-6">
                Are you sure you want to delete <span className="font-semibold">{selectedListing?.title}</span>? This
                action cannot be undone.
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ListingManagement