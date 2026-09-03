 // id to be passed 

import React, {  useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/AuthContext';
import { AddComment, deleteComment, getCommentswithReplies } from '../../../Api/commentsApi';
import { 
    Box, 
    Image, 
    IconButton, 
    Spinner, 
    Flex, 
    Divider, 
    VStack,
    Text,
    Avatar,
    Button,
    Textarea,
    HStack,
    useToast,
    Heading,
    FormControl,
    FormLabel
  } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
  

const baseUrl = import.meta.env.VITE_BACK_END_URL;
export default function AddCommentsInListing({toast,id,currentID,ownerID}) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [checkSubmit, setSetSubmit] = useState(false)
    
    const { user } = useAuth();


   

    const handleCommentSubmit = async (e) => {
      e.preventDefault();

      if(!user)
      {
        toast({
          title: "Login Required",
          description: "Login first to add a comment.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        setNewComment('')
        return;
      }

     

        if (newComment.trim()) {
          const commentData = {
            rental: id, // Pass the rental ID
            author: user._id, // Pass the current user ID
            text: newComment,
          };
    
          try {
            const response = await AddComment(commentData); // Call API to save the comment
            const savedComment = response.data;
    
            // Update state with the new comment
            setComments([
              {
                ...savedComment,
                userDetail: {
                  name: user.name,
                  avatar: `${import.meta.env.VITE_BACK_END_URL}${user.imageUrl}`,
                },
              },
              ...comments,
            ]);
            setNewComment('');
            setSetSubmit(true);
    
            toast({
              title: "Comment added",
              description: "Your comment has been successfully added.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } catch (error) {
            console.error('Error submitting comment', error);
            toast({
              title: "Error",
              description: "There was an issue adding your comment.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        }
      };




      useEffect(() => {
          async function fetchComments() {
            try {
             
              if (currentID) {
                const response = await getCommentswithReplies(currentID);
                setComments(response.data.comments || []);
                setSetSubmit(false);
              }
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to fetch comments.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          }
          fetchComments();
        }, [currentID, checkSubmit]);

         const handleDeleteComment = async (commentId) => {
            try {
              await deleteComment(commentId);
              setComments(comments.filter(comment => comment._id !== commentId));
              toast({
                title: "Success",
                description: "Comment deleted successfully.",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
            } catch (error) {
              toast({
                title: "Error",
                description: "Failed to delete comment.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          };


     
  return (
    <div>

        {/* <Box>
        <Text fontSize="xl" fontWeight="bold" mb={4}>Comments</Text>
       
            <Textarea
              bg={'white'}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
            />
            <Button my={4} variant={'customButton'} onClick={handleCommentSubmit}>
              Post Comment
            </Button>
        </Box> */}

<Box bg="white" boxShadow="md" borderRadius="lg" p={6}>
      <Heading as="h2" fontSize={'2xl'} fontWeight="semibold" mb={4}>
        Comments
      </Heading>

{
  user?._id !== ownerID && (
    <form onSubmit={handleCommentSubmit}>
        <FormControl mb={6} isRequired>
          <FormLabel htmlFor="comment" fontWeight="bold" color="gray.700">
            Your Comment
          </FormLabel>
          <Textarea
            id="comment"
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here..."
            focusBorderColor="orange.500"
          />
        </FormControl>
        <Button 
        //  bg="orange.500"
        //  color="white"
        //  _hover={{ bg: "orange.600" }}
        //  _focus={{ outline: "none", boxShadow: "outline" }}
        variant={'customButton'}
         type="submit"
       >
         Post Comment
       </Button>
      </form>

  )
}
  
      
      <VStack spacing={4} mt={6} align="stretch">
        {comments && comments.length > 0 ? (
          comments?.map((comment, i) => (
            <Box key={comment._id || i}>
              <Flex justify="space-between" align="center" mb={2}>
                <Flex justifyContent={'space-between'}>
                <Text fontWeight="semibold">{comment?.author?.name}</Text>
                
                </Flex>
               
                <Flex alignItems={'center'} gap={2} fontSize="sm" color="gray.500">
                  {new Date(comment?.createdAt).toLocaleDateString()}
                  {comment?.author?.name === user?.name && (
                          <IconButton
                            size="sm"
                            icon={<DeleteIcon />}
                            onClick={() => handleDeleteComment(comment?._id)}
                            aria-label="Delete comment"
                          />
                        )}
                </Flex>
              </Flex>
              <Text mb={3} color="gray.700">{comment.text}</Text>
              <Divider borderColor="gray.200" />
            </Box>
          ))
        ) : (<Text>💬 No comments on this listing yet 💬</Text>) }
      </VStack>
    </Box>

        
      
    </div>
  )
}
