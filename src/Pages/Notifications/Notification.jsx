import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
    Box,
    Button,
    Flex,
    Text,
    useDisclosure,
    Badge,
  } from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react'
import { FaBell, FaHome, FaComments, FaEllipsisH, FaCheck, FaTrash } from 'react-icons/fa'
import { clearAllNotifications, readAllNotifications, readOneNotification } from '../../Api/Notification';
import { NotificationContext } from '../../hooks/NotificationContext';
import { useLocation } from 'react-router-dom';

export default function Notification({}) {
  const [notificationData, setNotificationData] = useState([]);
  const [activeTab, setActiveTab] = useState('all')
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAll,
    deleteRead,
    toggleRead,
    setUnreadCount,
  } = useContext(NotificationContext);
  


  useEffect(()=>{
    if(!notifications) return;
    const count = notifications.filter((n) => !n.isRead).length;
     setUnreadCount(count);
    setNotificationData(notifications)

  },[notifications])
  

  const filterNotifications = (type) => {
    if (type === 'all') {
      return notificationData; 
    }
  
    // Filter notifications that match the specified type
    const filtered = notificationData.filter(n => n.type === type);
    
    return filtered;
  };


  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const togglePopover = () => {
    isOpen ? onClose() : onOpen();
  };

  return (
    <Popover placement="bottom-start" isOpen={isOpen} onClose={onClose} >
      <PopoverTrigger>
      <Box as="span" cursor="pointer" onClick={togglePopover} position="relative">
      <FaBell className={`h-6 w-6 ${location.pathname === '/' ? 'text-gray-200' : 'text-gray-700'}`} />

      {/* Display the unread count if greater than 0 */}
      {unreadCount > 0 && (
        <Badge
          position="absolute"
          top="-2"
          right="-2"
          bg="orange.500" // Orange background
          color="white" // White text
          borderRadius="full" // Circular shape
          fontSize="xs" // Small text size
          px="2" // Horizontal padding
          py="0.5" // Vertical padding
        >
          {unreadCount}
        </Badge>
      )}
    </Box>

      </PopoverTrigger>
      <PopoverContent zIndex={1}>
        <PopoverArrow />
        <PopoverCloseButton color="teal" />
        <PopoverHeader color="black">Notifications</PopoverHeader>
        <PopoverBody>
          <Box>
            {/* Tabs Header */}
            <Flex borderBottom="1px" borderColor="gray.200">
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'all' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'all' ? '2px solid' : 'none'}
    borderColor={activeTab === 'all' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('all')}
  >
    All
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'review' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'review' ? '2px solid' : 'none'}
    borderColor={activeTab === 'review' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('review')}
  >
    Reviews
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'comment' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'comment' ? '2px solid' : 'none'}
    borderColor={activeTab === 'comment' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('comment')}
  >
    Comments
  </Button>
  <Button
    flex="1"
    py={2}
    px={4}
    fontSize="sm"
    fontWeight="medium"
    variant="ghost"
    borderRadius="0"
    _hover={{ bg: 'orange.50' }}
    color={activeTab === 'other' ? 'orange.500' : 'gray.500'}
    borderBottom={activeTab === 'other' ? '2px solid' : 'none'}
    borderColor={activeTab === 'other' ? 'orange.500' : 'transparent'}
    onClick={() => setActiveTab('other')}
  >
    Other
  </Button>
</Flex>

  
            {/* notifications List */}
            <Box maxH="80" overflowY="auto">
              {filterNotifications(activeTab).map((notification, i) => (
                <Box
                  key={notification._id|| i}
                  p={4}
                  borderBottom="1px"
                  borderColor="gray.200"
                  bg={notification.isRead ? 'gray.50' : 'white'}
                >
                  <Flex alignItems="start">
                    <Box flexShrink={0} mt={1}>
                      {notification.type === 'review' && <FaHome color="blue" />}
                      {notification.type === 'comment' && <FaComments color="green" />}
                      {notification.type === 'other' && <FaEllipsisH color="purple" />}
                    </Box>
                    <Box ml={3} flex="1">
                      <Text fontSize="sm" color={notification.isRead ? 'gray.500' : 'gray.900'}>
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500" mt={1}>
                        {formatTimestamp(notification.createdAt)}
                      </Text>
                    </Box>
                    <Button
                      onClick={() => toggleRead(notification._id)}
                      variant="ghost"
                      ml={2}
                      color="gray.400"
                      _hover={{ color: 'gray.600' }}
                      
                    >
                      <FaCheck color={notification.isRead ? 'green' : undefined} />
                    </Button>
                  </Flex>
                </Box>
              ))}
            </Box>
  
            {/* Footer Buttons */}
            <Flex justify="space-between" p={4} borderTop="1px" borderColor="gray.200">
              <Button
                variant="link"
                fontSize="sm"
                color="orange.500"
                _hover={{ color: 'orange.600' }}
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
              <Button
                variant="link"
                fontSize="sm"
                color="red.500"
                _hover={{ color: 'red.600' }}
                onClick={clearAll}
              >
                Clear all
              </Button>
              <Button
                variant="link"
                fontSize="sm"
                color="gray.500"
                _hover={{ color: 'gray.600' }}
                onClick={deleteRead}
              >
                Delete read
              </Button>
            </Flex>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}