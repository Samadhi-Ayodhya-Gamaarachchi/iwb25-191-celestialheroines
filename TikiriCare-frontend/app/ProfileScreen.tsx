// app/(tabs)/ProfileScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';


export default function ProfileScreen() {
  const [children, setChildren] = useState([
    {
      id: 1,
      name: 'Malith Fernando',
      age: '2 years 3 months',
      gender: 'Male',
      avatar: 'M',
      color: '#4A90E2', // Blue for boys
    },
    {
      id: 2,
      name: 'Amaya Fernando',
      age: '6 months',
      gender: 'Female',
      avatar: 'A',
      color: '#E94B7D', // Pink for girls
    },
  ]);

  const [settingsVisible, setSettingsVisible] = useState(false);
  const [helpVisible, setHelpVisible] = useState(false);
  const router = useRouter();


  const handleAddChild = () => {
    router.push('/Add_child');

  };

  const handleEditProfile = () => {
    router.push('/EditProfile_Parent')  ;
  };

  const handleChildPress = (childName: string) => {
    Alert.alert('Child Details', `View details for ${childName}`);
  };

  const SettingsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={settingsVisible}
      onRequestClose={() => setSettingsVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Settings</Text>
            <TouchableOpacity onPress={() => setSettingsVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.settingsContent}>
            <TouchableOpacity style={styles.settingItem} onPress={handleEditProfile}>
              <Ionicons name="person-outline" size={20} color="#4A90E2" />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={20} color="#FF6B35" />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="shield-outline" size={20} color="#28A745" />
              <Text style={styles.settingText}>Privacy & Security</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="language-outline" size={20} color="#FFC107" />
              <Text style={styles.settingText}>Language</Text>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </TouchableOpacity>
            
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const HelpModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={helpVisible}
      onRequestClose={() => setHelpVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Help & Support</Text>
            <TouchableOpacity onPress={() => setHelpVisible(false)}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.helpContent}>
            <View style={styles.helpSection}>
              <Text style={styles.helpSectionTitle}>Contact TikiriCare </Text>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call" size={20} color="#DC3545" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Emergency Hotline</Text>
                  <Text style={styles.contactValue}>+94 11 123 4567</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call" size={20} color="#28A745" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Customer Service</Text>
                  <Text style={styles.contactValue}>+94 11 987 6543</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="mail" size={20} color="#4A90E2" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Email Support</Text>
                  <Text style={styles.contactValue}>support@tikiricare.lk</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="location" size={20} color="#FF6B35" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Address</Text>
                  <Text style={styles.contactValue}>123 Healthcare Street,{'\n'}Colombo 07, Sri Lanka</Text>
                </View>
              </View>
              
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="time" size={20} color="#6C757D" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>Working Hours</Text>
                  <Text style={styles.contactValue}>24/7 Emergency{'\n'}Mon-Fri: 8AM-6PM (General)</Text>
                </View>
              </View>
            </View>
            
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>S</Text>
            </View>
          </View>
          
          <Text style={styles.profileName}>Sarah Fernando</Text>
          <Text style={styles.profileRole}>Parent / Guardian</Text>
          
          <View style={styles.contactInfo}>
            <View style={styles.contactRow}>
              <Ionicons name="call" size={16} color="#28A745" />
              <Text style={styles.contactText}>+94 71 234 5678</Text>
            </View>
            <View style={styles.contactRow}>
              <Ionicons name="mail" size={16} color="#4A90E2" />
              <Text style={styles.contactText}>sarah.f@gmail.com</Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>Children</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSettingsVisible(true)}>
            <Text style={styles.tabText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setHelpVisible(true)}>
            <Text style={styles.tabText}>Help</Text>
          </TouchableOpacity>
        </View>

        {/* My Children Section */}
        <View style={styles.childrenSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Children</Text>
            <TouchableOpacity style={styles.addChildButton} onPress={handleAddChild}>
              <Ionicons name="add" size={16} color="#fff" />
              <Text style={styles.addChildText}>Add Child</Text>
            </TouchableOpacity>
          </View>

          {/* Children List */}
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.childCard}
              onPress={() => handleChildPress(child.name)}
            >
              <View style={[styles.childAvatar, { backgroundColor: child.color }]}>
                <Text style={styles.childAvatarText}>{child.avatar}</Text>
              </View>
              <View style={styles.childInfo}>
                <Text style={styles.childName}>{child.name}</Text>
                <Text style={styles.childDetails}>
                  {child.age} • {child.gender}
                </Text>
              </View>
              <TouchableOpacity style={styles.childInfoButton}>
                <Ionicons name="information-circle-outline" size={20} color="#4A90E2" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <SettingsModal />
      <HelpModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', // Clean, professional light gray
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50', // Dark blue-gray for headers
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4A90E2', // Professional blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  profileRole: {
    fontSize: 16,
    color: '#6C757D',
    marginBottom: 20,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#495057',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#28A745', // Green for active state
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  childrenSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C3E50',
  },
  addChildButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28A745', // Green for positive action
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addChildText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  childAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 2,
  },
  childDetails: {
    fontSize: 14,
    color: '#6C757D',
  },
  childInfoButton: {
    padding: 5,
  },
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
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  helpItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#495057',
  },
});