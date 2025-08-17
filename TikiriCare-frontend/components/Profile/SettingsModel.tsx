// components/SettingsModal.tsx
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

interface SettingsItem {
  id: string;
  icon: string;
  label: string;
  color: string;
  onPress?: () => void;
}

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onEditProfile: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  onEditProfile,
}) => {
  const settingsItems: SettingsItem[] = [
    {
      id: 'edit-profile',
      icon: 'person-outline',
      label: 'Edit Profile',
      color: '#4A90E2',
      onPress: onEditProfile,
    },
    {
      id: 'notifications',
      icon: 'notifications-outline',
      label: 'Notifications',
      color: '#FF6B35',
    },
    {
      id: 'privacy',
      icon: 'shield-outline',
      label: 'Privacy & Security',
      color: '#28A745',
    },
    {
      id: 'language',
      icon: 'language-outline',
      label: 'Language',
      color: '#FFC107',
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
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            {settingsItems.map((item) => (
              <TouchableOpacity 
                key={item.id}
                style={styles.settingItem} 
                onPress={item.onPress}
              >
                <Ionicons name={item.icon as any} size={20} color={item.color} />
                <Text style={styles.settingText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={16} color="#ccc" />
              </TouchableOpacity>
            ))}
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
  settingsContent: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  settingText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#495057',
  },
});