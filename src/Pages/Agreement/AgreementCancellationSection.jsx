import { useState } from 'react';
import {
  Alert, AlertIcon, AlertTitle, AlertDescription,
  Box, Button, Flex, FormControl, FormLabel, Heading, Modal,
  ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter,
  ModalCloseButton, Text, Textarea, useDisclosure, useToast,
} from '@chakra-ui/react';
import { AlertTriangle, Ban, CheckCircle, XCircle } from 'lucide-react';
import {
  requestAgreementCancellation,
  confirmAgreementCancellation,
  declineAgreementCancellation,
} from '../../Api/Agreement';

export function AgreementCancellationBanner({
  agreement,
  currentUserId,
  onUpdated,
}) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [declining, setDeclining] = useState(false);

  if (!agreement) return null;

  const aggId = agreement._id;
  const status = String(agreement.agreementStatus || '').toLowerCase();
  const cancellation = agreement.cancellation || {};
  const isCancelled = status === 'cancelled' || cancellation.status === 'confirmed';
  const isPendingCancellation = status === 'cancellation_requested' || cancellation.status === 'pending';
  const isRequester = String(cancellation.requestedBy?._id || cancellation.requestedBy) === String(currentUserId);

  if (isCancelled) {
    const cancelDate = cancellation.confirmedAt || cancellation.cancellationAgreementDate || agreement.updatedAt;
    const dateFormatted = cancelDate && Number.isFinite(new Date(cancelDate).getTime())
      ? new Date(cancelDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
      : 'recently';

    return (
      <Alert status="error" variant="left-accent" rounded="xl" mb={6}>
        <AlertIcon as={Ban} />
        <Box flex="1">
          <AlertTitle fontSize="md" fontWeight="bold">Rental Agreement Cancelled</AlertTitle>
          <AlertDescription fontSize="sm" mt={1}>
            This rental agreement was mutually cancelled on {dateFormatted}. The property is available and all terms are terminated.
          </AlertDescription>
          {cancellation.reason && (
            <Text fontSize="xs" color="gray.600" mt={2} fontStyle="italic">
              Reason: {cancellation.reason}
            </Text>
          )}
        </Box>
      </Alert>
    );
  }

  if (isPendingCancellation) {
    const handleConfirm = async () => {
      setConfirming(true);
      try {
        const response = await confirmAgreementCancellation({ aggId });
        toast({
          title: 'Cancellation Confirmed',
          description: 'The agreement has been cancelled by mutual agreement.',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
        if (onUpdated) onUpdated(response.data?.data);
      } catch (err) {
        toast({
          title: 'Could not confirm cancellation',
          description: err.response?.data?.message || 'Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setConfirming(false);
      }
    };

    const handleDecline = async () => {
      setDeclining(true);
      try {
        const response = await declineAgreementCancellation({ aggId, reason: 'Declined by recipient.' });
        toast({
          title: 'Cancellation Request Declined',
          description: 'The cancellation request has been declined and the agreement remains active.',
          status: 'info',
          duration: 4000,
          isClosable: true,
        });
        if (onUpdated) onUpdated(response.data?.data);
      } catch (err) {
        toast({
          title: 'Could not decline cancellation',
          description: err.response?.data?.message || 'Please try again.',
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setDeclining(false);
      }
    };

    return (
      <Alert status="warning" variant="left-accent" rounded="xl" mb={6}>
        <AlertIcon as={AlertTriangle} boxSize="22px" />
        <Box flex="1">
          <AlertTitle fontSize="md" fontWeight="bold">Cancellation Agreement Pending</AlertTitle>
          <AlertDescription fontSize="sm" mt={1}>
            {isRequester
              ? 'You have sent a cancellation agreement. Waiting for the other party to review and confirm.'
              : 'The other party has requested to cancel this rental agreement. Both parties must confirm before the agreement is cancelled.'}
          </AlertDescription>
          {cancellation.reason && (
            <Box bg="blackAlpha.50" p={3} rounded="lg" mt={2}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.700">Reason provided:</Text>
              <Text fontSize="xs" color="gray.600">{cancellation.reason}</Text>
            </Box>
          )}
          {!isRequester && (
            <Flex gap={3} mt={4} wrap="wrap">
              <Button
                colorScheme="red"
                size="sm"
                leftIcon={<CheckCircle size={15} />}
                isLoading={confirming}
                loadingText="Confirming..."
                onClick={handleConfirm}
              >
                Confirm & Cancel Agreement
              </Button>
              <Button
                variant="outline"
                size="sm"
                isLoading={declining}
                loadingText="Declining..."
                onClick={handleDecline}
              >
                Decline Cancellation
              </Button>
            </Flex>
          )}
        </Box>
      </Alert>
    );
  }

  return null;
}

export function AgreementCancelButton({
  agreement,
  currentUserId,
  onUpdated,
}) {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!agreement) return null;

  const aggId = agreement._id;
  const status = String(agreement.agreementStatus || '').toLowerCase();
  const cancellation = agreement.cancellation || {};
  const isCancelled = status === 'cancelled' || cancellation.status === 'confirmed';
  const isPendingCancellation = status === 'cancellation_requested' || cancellation.status === 'pending';

  if (isCancelled || isPendingCancellation) return null;

  const isConfirmedAgreement = agreement.ownerConfirmed && agreement.renterConfirmed;

  const handleRequestCancellation = async () => {
    setSubmitting(true);
    try {
      const response = await requestAgreementCancellation({
        aggId,
        reason: reason.trim(),
      });
      toast({
        title: isConfirmedAgreement ? 'Cancellation Agreement Sent' : 'Agreement Cancelled',
        description: isConfirmedAgreement
          ? 'Cancellation request sent to the renter. Both must confirm to complete cancellation.'
          : 'The unconfirmed agreement has been cancelled.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      onClose();
      if (onUpdated) onUpdated(response.data?.data);
    } catch (err) {
      toast({
        title: 'Could not request cancellation',
        description: err.response?.data?.message || 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        colorScheme="red"
        size="md"
        leftIcon={<XCircle size={16} />}
        onClick={onOpen}
      >
        Cancel Agreement
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent mx={4} rounded="xl">
          <ModalHeader>Cancel Rental Agreement</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="sm" color="gray.600" mb={4}>
              {isConfirmedAgreement
                ? 'Cancelling an active agreement will send a Cancellation Agreement to the renter. Both parties must confirm before the agreement is officially terminated and the listing becomes available again.'
                : 'The renter has not yet confirmed this agreement. Cancelling will withdraw it immediately and make the listing available again.'}
            </Text>
            <FormControl>
              <FormLabel fontSize="sm">Reason for cancellation (optional)</FormLabel>
              <Textarea
                placeholder="e.g., Change in plans, property maintenance, etc."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={300}
                rows={3}
                rounded="lg"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onClose} isDisabled={submitting}>
              Go back
            </Button>
            <Button
              colorScheme="red"
              isLoading={submitting}
              loadingText="Sending..."
              onClick={handleRequestCancellation}
            >
              {isConfirmedAgreement ? 'Send Cancellation Agreement' : 'Cancel Agreement'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function AgreementCancellationSection({ agreement, currentUserId, onUpdated }) {
  return (
    <>
      <AgreementCancellationBanner agreement={agreement} currentUserId={currentUserId} onUpdated={onUpdated} />
      <AgreementCancelButton agreement={agreement} currentUserId={currentUserId} onUpdated={onUpdated} />
    </>
  );
}
