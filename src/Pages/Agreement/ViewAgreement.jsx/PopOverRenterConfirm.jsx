import { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Text, useToast } from '@chakra-ui/react';
import { VerifyAggrementByRenter } from '../../../Api/Agreement';
export default function PopOverRenterConfirm({ aggId, renterConfirmed, setRenterConfirmed }) {
  const [saving, setSaving] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const toast = useToast();
  const save = async () => {
    if (saving || !aggId) return;
    setSaving(true);
    try {
      await VerifyAggrementByRenter({ aggId, renterConfirmed: true });
      setConfirmed(true);
      toast({ title: 'Agreement confirmed', description: 'Your rental is now shown in My rentals.', status: 'success', isClosable: true });
    } catch (error) {
      setRenterConfirmed(false);
      toast({ title: 'Could not confirm agreement', description: error.response?.data?.message || 'Please try again.', status: 'error', isClosable: true });
    } finally { setSaving(false); }
  };
  return <Modal isOpen={renterConfirmed && !confirmed} onClose={() => { if (!saving) setRenterConfirmed(false); }} isCentered closeOnOverlayClick={!saving} closeOnEsc={!saving}><ModalOverlay /><ModalContent mx={4}><ModalHeader>Confirm your rental agreement</ModalHeader><ModalBody><Text>Confirm that you have reviewed and accept the rental dates, price, and terms in this agreement.</Text></ModalBody><ModalFooter gap={3}><Button variant="outline" isDisabled={saving} onClick={() => setRenterConfirmed(false)}>Go back</Button><Button colorScheme="teal" isLoading={saving} onClick={save}>Confirm agreement</Button></ModalFooter></ModalContent></Modal>;
}
