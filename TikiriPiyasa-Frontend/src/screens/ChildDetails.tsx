import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import type { ChildInfo } from './ChildrenListScreen';

const { width } = Dimensions.get('window');

type Route = RouteProp<RootStackParamList, 'ChildDetails'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'ChildDetails'>;

// TEMP in-memory source – replace with global store / API selector
const MOCK_CHILDREN: ChildInfo[] = [
  {
    id: 'c1',
    name: 'Emma Johnson',
    ageYears: 3,
    dob: '2021-03-15',
    allergies: 'Peanuts',
    notes: 'Shy during group meals',
    enrolledAt: '2024-01-20',
    parent: {
      id: 'p1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+94 77 123 4567',
      address: 'Colombo 07'
    }
  },
  {
    id: 'c2',
    name: 'Alex Brown',
    ageYears: 4,
    dob: '2020-07-22',
    allergies: 'None',
    notes: 'Enjoys art & music',
    enrolledAt: '2024-01-21',
    parent: {
      id: 'p2',
      name: 'Michael Brown',
      email: 'michael@example.com',
      phone: '+94 77 987 6543'
    }
  }
];

const ChildDetails: React.FC = () => {
  const { params } = useRoute<Route>();
  const navigation = useNavigation<Nav>();

  const child = useMemo(
    () => MOCK_CHILDREN.find(c => c.id === params.childId),
    [params.childId]
  );

  if (!child) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>😕</Text>
        <Text style={styles.errorTitle}>Child not found</Text>
        <Text style={styles.errorText}>The child you're looking for doesn't exist.</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Child', 
      `Are you sure you want to unenroll ${child.name}? This action cannot be undone.`, 
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => {
            // TODO: Remove child from store
            navigation.goBack();
          }
        }
      ]
    );
  };

  const handleCall = (phone: string) => {
    Alert.alert('Call Parent', `Would you like to call ${phone}?`);
  };

  const handleEmail = (email: string) => {
    Alert.alert('Send Email', `Would you like to email ${email}?`);
  };

  return (
    <View style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: getAvatarColor(child.id) }]}>
              <Text style={styles.avatarText}>{getInitials(child.name)}</Text>
            </View>
            <View style={styles.ageTag}>
              <Text style={styles.ageText}>{child.ageYears}</Text>
            </View>
          </View>
          <Text style={styles.childName}>{child.name}</Text>
          <Text style={styles.enrolledInfo}>Enrolled since {child.enrolledAt}</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Stats */}
        <View style={styles.quickStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>🎂</Text>
            <Text style={styles.statLabel}>Age</Text>
            <Text style={styles.statValue}>{child.ageYears} years</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📅</Text>
            <Text style={styles.statLabel}>Born</Text>
            <Text style={styles.statValue}>{child.dob}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>⚠️</Text>
            <Text style={styles.statLabel}>Allergies</Text>
            <Text style={[
              styles.statValue, 
              child.allergies === 'None' ? styles.safeText : styles.alertText
            ]}>
              {child.allergies || 'None'}
            </Text>
          </View>
        </View>

        {/* Child Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👶 Child Information</Text>
          </View>
          
          <DetailRow icon="👤" label="Full Name" value={child.name} />
          <DetailRow icon="📅" label="Date of Birth" value={child.dob} />
          <DetailRow icon="📊" label="Age" value={`${child.ageYears} years old`} />
          
          {child.allergies && child.allergies !== 'None' && (
            <View style={styles.allergyAlert}>
              <Text style={styles.allergyIcon}>⚠️</Text>
              <View style={styles.allergyContent}>
                <Text style={styles.allergyTitle}>Allergy Alert</Text>
                <Text style={styles.allergyText}>{child.allergies}</Text>
              </View>
            </View>
          )}

          {child.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.notesTitle}>📝 Special Notes</Text>
              <Text style={styles.notesText}>{child.notes}</Text>
            </View>
          )}
        </View>

        {/* Parent Information Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>👨‍👩‍👧‍👦 Parent / Guardian</Text>
          </View>
          
          <DetailRow icon="👤" label="Name" value={child.parent.name} />
          
          <TouchableOpacity onPress={() => handleEmail(child.parent.email)}>
            <DetailRow 
              icon="✉️" 
              label="Email" 
              value={child.parent.email} 
              showArrow 
            />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={() => handleCall(child.parent.phone)}>
            <DetailRow 
              icon="📱" 
              label="Phone" 
              value={child.parent.phone} 
              showArrow 
            />
          </TouchableOpacity>
          
          {child.parent.address && (
            <DetailRow icon="📍" label="Address" value={child.parent.address} />
          )}

          {/* Quick Contact Actions */}
          <View style={styles.contactActions}>
            <TouchableOpacity 
              style={[styles.contactBtn, styles.callBtn]}
              onPress={() => handleCall(child.parent.phone)}
            >
              <Text style={styles.contactIcon}>📞</Text>
              <Text style={styles.contactText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.contactBtn, styles.emailBtn]}
              onPress={() => handleEmail(child.parent.email)}
            >
              <Text style={styles.contactIcon}>✉️</Text>
              <Text style={styles.contactText}>Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const DetailRow: React.FC<{
  icon: string;
  label: string;
  value: string;
  showArrow?: boolean;
}> = ({ icon, label, value, showArrow }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View style={styles.detailContent}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
    {showArrow && <Text style={styles.detailArrow}>→</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  headerContent: {
    alignItems: 'center',
    marginTop: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  ageTag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  ageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  childName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  enrolledInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  quickStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  safeText: {
    color: '#27AE60',
  },
  alertText: {
    color: '#E74C3C',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFF',
  },
  detailIcon: {
    fontSize: 20,
    marginRight: 15,
    width: 25,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  detailArrow: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: 'bold',
  },
  allergyAlert: {
    flexDirection: 'row',
    backgroundColor: '#FFF5F5',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#E74C3C',
  },
  allergyIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  allergyContent: {
    flex: 1,
  },
  allergyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E74C3C',
    marginBottom: 4,
  },
  allergyText: {
    fontSize: 14,
    color: '#C0392B',
  },
  notesSection: {
    margin: 20,
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  contactActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  callBtn: {
    backgroundColor: '#4CAF50',
  },
  emailBtn: {
    backgroundColor: '#2196F3',
  },
  contactIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  contactText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  actionSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F8FAFF',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  errorButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChildDetails;