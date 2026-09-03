import React, { useEffect, useState } from 'react'
import {  Text, VStack, Flex, Icon, Button, Box, Badge , Table, Thead, Tbody, Tr, Th, Td,} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import { Calendar, CreditCard, MessageSquare, SearchIcon, FileText, Star, User } from 'lucide-react'
import { fetchAllRenterAggreements } from '../../Api/renter';
import { fetchConversationsForSidebar } from '../../Api/Chats';
import { Link } from 'react-router-dom';




export default function UserDash() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agreementDetail, setAgreementDetail] = useState([]);
  const [messageCount, setMessageCount] = useState(0);


  useEffect(()=>{

    const fetchAggreements = async() =>{
      try {
        const response = await fetchAllRenterAggreements()
      
        setAgreementDetail(response?.data?.data?.aggreements || [])
        
        
      } catch (error) {
        console.log(error)
        
      }

    }

    fetchAggreements();

    const fetchMessages = async () => {
      try {
        const response = await fetchConversationsForSidebar();
        setMessageCount(response?.data?.data?.length || 0);
      } catch (error) {
        setMessageCount(0);
      }
    };

    fetchMessages();

    },[])

  const getAgreementDetails = (agreement) => agreement?.agreementDetailsId?.aggrementDetail || {};
  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : "—";

  const upcomingRentals = agreementDetail
    .filter((agreement) => {
      const details = getAgreementDetails(agreement);
      return details.endDate && new Date(details.endDate) >= new Date() && agreement.agreementStatus !== "rejected";
    })
    .sort((a, b) => new Date(getAgreementDetails(a).startDate) - new Date(getAgreementDetails(b).startDate))
    .map((agreement) => {
      const details = getAgreementDetails(agreement);
      return {
        id: agreement._id,
        item: agreement?.listingId?.title || "Untitled listing",
        owner: agreement?.ownerId?.name || "Unknown owner",
        startDate: formatDate(details.startDate),
        endDate: formatDate(details.endDate),
        status: agreement.agreementStatus || "pending",
      };
    });

  const totalSpent = agreementDetail.reduce((total, agreement) => {
    const details = getAgreementDetails(agreement);
    const amount = Number(details.rentAmount ?? details.RentAmount ?? 0);
    return total + (Number.isFinite(amount) ? amount : 0);
  }, 0);

  const recentActivity = [...agreementDetail]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 5)
    .map((agreement) => ({
      id: agreement._id,
      action: `${agreement?.listingId?.title || "Listing"} agreement is ${agreement.agreementStatus || "pending"}`,
      date: formatDate(agreement.updatedAt || agreement.createdAt),
    }));


  const renderDashboard = () => (
    <>
    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard title="Upcoming Rentals" icon={Calendar} value={upcomingRentals.length} subtext={upcomingRentals[0] ? `Next rental starts ${upcomingRentals[0].startDate}` : "No upcoming rentals"} />
        <DashboardCard title="Total Rent Value" icon={CreditCard} value={`$${totalSpent.toLocaleString()}`} subtext={`${agreementDetail.length} agreement${agreementDetail.length === 1 ? "" : "s"}`} />
        <DashboardCard title="Conversations" icon={MessageSquare} value={messageCount} subtext="Total conversations" />
        <DashboardCard title="Saved Searches" icon={SearchIcon} value="0" subtext="Saved searches are not configured" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Rentals</h3>
          </div>
          <div className="p-4 sm:p-6 overflow-x-auto">
  <table className="w-full min-w-[600px]">
    <thead>
      <tr className="text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
        <th className="pb-2 pr-4">Item</th>
        <th className="pb-2 pr-4">Owner</th>
        <th className="pb-2 pr-4">Dates</th>
        <th className="pb-2">Status</th>
      </tr>
    </thead>
    <tbody>
      {upcomingRentals.length > 0 ? upcomingRentals.map((rental) => (
        <tr key={rental.id} className="border-t border-gray-200 text-sm sm:text-base">
          <td className="py-3 pr-4 font-medium">{rental.item}</td>
          <td className="py-3 pr-4">{rental.owner}</td>
          <td className="py-3 pr-4">{`${rental.startDate} - ${rental.endDate}`}</td>
          <td className="py-3">
            <span
              className={`px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
                  rental.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {rental.status}
            </span>
          </td>
        </tr>
      )) : (
        <tr>
          <td colSpan="4" className="py-4 text-center text-gray-500">No upcoming rentals</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Button variant={'dashboardButton'} w={'full'}>
              View All Rentals
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">Your latest actions and updates</p>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity) => (
                <li key={activity.id} className="flex justify-between items-center">
                  <span>{activity.action}</span>
                  <span className="text-sm text-gray-500">{activity.date}</span>
                </li>
              )) : <li className="text-gray-500">No recent activity</li>}
            </ul>
          </div>
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Button variant={'dashboardButton'} w={'full'}>
              View Full Activity Log
            </Button>
          </div>
        </div>
      </div>
     

      {/* <div className="mt-8 flex justify-center">
        <button className="px-6 py-3 bg-teal-600 text-white rounded-full hover:bg-teal-700 transition-colors flex items-center">
          <SearchIcon size={16} className="mr-2" />
          Start New Search
        </button>
      </div> */}
    </>
  )

  const renderAgreements = () => {

   

    return (
      <Box bg="white" borderRadius="lg" shadow="lg" overflow="hidden">
      <Box px={6} py={4} bg="gray.50" borderBottomWidth="1px" borderColor="gray.200">
        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="semibold" color="gray.900">
          Rental Agreements
        </Text>
      </Box>
    
      <Box p={{ base: 4, md: 6 }} overflowX="auto">
        <Table variant="simple" size="sm" width="full">
          <Thead>
            <Tr>
              {['List Title', 'Owner', 'Dates', 'Status', 'Action'].map((heading) => (
                <Th
                  key={heading}
                  pb={2}
                  textTransform="uppercase"
                  fontSize="xs"
                  fontWeight="medium"
                  color="gray.500"
                  whiteSpace="nowrap"
                >
                  {heading}
                </Th>
              ))}
            </Tr>
          </Thead>
    
          <Tbody>
            {agreementDetail && agreementDetail.length > 0 ? (
              agreementDetail.map((agreement) => (
                <Tr key={agreement._id} borderTopWidth="1px" borderColor="gray.200">
                  <Td py={3} fontWeight="medium" whiteSpace="nowrap">
                    {agreement?.listingId?.title}
                  </Td>
                  <Td py={3} whiteSpace="nowrap">{agreement.ownerId.name}</Td>
                  <Td py={3} whiteSpace="nowrap">
                    {`${agreement?.agreementDetailsId?.aggrementDetail.startDate} - ${agreement?.agreementDetailsId?.aggrementDetail.endDate}`}
                  </Td>
                  <Td py={3}>
                    <Badge
                      px={2}
                      fontSize="xs"
                      fontWeight="semibold"
                      borderRadius="full"
                      colorScheme={
                        agreement.agreementStatus === 'active'
                          ? 'green'
                          : agreement.agreementStatus === 'pending'
                          ? 'yellow'
                          : 'gray'
                      }
                    >
                      {agreement?.agreementStatus}
                    </Badge>
                  </Td>
                  <Td py={3}>
                    <Link
                      to={
                        agreement?.listingId?.category === 'house'
                          ? `/viewHouseAgreement/${agreement._id}`
                          : agreement?.listingId?.category === 'car'
                          ? `/viewCarAgreement/${agreement._id}`
                          : `/viewHostelAgreement/${agreement._id}`
                      }
                      color="blue.600"
                      _hover={{ color: 'blue.800' }}
                    >
                      View Agreement
                    </Link>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={5}>
                  <Text fontSize="sm" textAlign="center" py={4}>
                    No agreement created yet
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>
    </Box>
    
  
    )

  } 




  return (
    <div className="min-h-screen bg-whiteAlpha-800 px-4 py-6 sm:px-2 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Renter Dashboard</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'dashboard' 
                  ? 'bg-orange-400 text-white' 
                  : 'text-gray-700 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('agreements')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                activeTab === 'agreements' 
                 ? 'bg-orange-400 text-white' 
                  : 'text-gray-700 hover:bg-orange-100 hover:text-orange-500'
              }`}
            >
              Agreements
            </button>
           
          </nav>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'agreements' && renderAgreements()}
        
      </div>
    </div>
  )
}

// interface DashboardCardProps {
//   title: string
//   icon: React.ElementType
//   value: string
//   subtext: string
// }

const DashboardCard = ({ title, icon: Icon, value, subtext }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
  <div className="flex justify-between items-center mb-3 sm:mb-4">
    <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
    <Icon size={20} className="text-gray-400" />
  </div>
  <p className="text-2xl sm:text-3xl font-bold mb-1">{value}</p>
  <p className="text-xs sm:text-sm text-gray-500">{subtext}</p>
</div>

)
