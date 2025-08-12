// components/HelpModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ContactItem {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
}

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  const contactItems: ContactItem[] = [
    {
      id: 'emergency',
      icon: 'call',
      label: 'Emergency Hotline',
      value: '+94 11 123 4567',
      color: '#DC3545',
    },
    {
      id: 'customer-service',
      icon: 'call',
      label: 'Customer Service',
      value: '+94 11 987 6543',
      color: '#28A745',
    },
    {
      id: 'email',
      icon: 'mail',
      label: 'Email Support',
      value: 'support@tikiricare.lk',
      color: '#4A90E2',
    },
    {
      id: 'address',
      icon: 'location',
      label: 'Address',
      value: '123 Healthcare Street,\nColombo 07, Sri Lanka',
      color: '#FF6B35',
    },
    {
      id: 'hours',
      icon: 'time',
      label: 'Working Hours',
      value: '24/7 Emergency\nMon-Fri: 8AM-6PM (General)',
      color: '#6C757D',
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.helpContent}>
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Contact TikiriCare</Text>
              
              {contactItems.map((item) => (
                <View key={item.id} style={styles.contactItem}>
                  <View style={styles.contactIcon}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactLabel}>{item.label}</Text>
                    <Text style={styles.contactValue}>{item.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  helpContent: {
    padding: 20,
  },
  helpSection: {
    marginBottom: 30,
  },
  helpSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 18,
  },
});