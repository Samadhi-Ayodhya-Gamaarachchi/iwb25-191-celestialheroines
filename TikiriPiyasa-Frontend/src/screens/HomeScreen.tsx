import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

interface HomeScreenProps {
  onEditProfile?: () => void;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<HomeScreenProps> = ({ onEditProfile }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const centerProfile = {
    name: 'Tikiri Piyasa',
    logo: require('../asset/Tikiri_piyasa.png'), // Local image reference
    location: '123 Main St, Colombo',
    openingHours: '8:00 AM - 5:00 PM',
    facilities: 5,
  };

  const stats = [
    { label: 'Total Children Enrolled', value: 120, icon: '👶', color: '#FF6B6B' },
    { label: 'Total Parents Connected', value: 85, icon: '👨‍👩‍👧', color: '#4ECDC4' },
    { label: 'Pending Parent Requests', value: 2, icon: '📩', color: '#45B7D1' },
  ];

  const pendingRequests = [
    { id: 1, parent: 'Mrs. Silva', child: 'Nimal', date: '2025-08-20' },
    { id: 2, parent: 'Mr. Perera', child: 'Kamal', date: '2025-08-21' },
  ];

  const announcements = [
    { id: 1, message: "Annual Sports Day on Sep 10th!", date: "2025-08-22", priority: "high" },
    { id: 2, message: "Vaccination camp next week.", date: "2025-08-21", priority: "medium" },
  ];

  const quickActions = [
    { title: 'Add/Edit Center Details', icon: '🏢', color: '#667eea' },
    { title: 'Update Photos', icon: '📸', color: '#f093fb' },
    { title: 'Manage Parents & Children', icon: '👥', color: '#4facfe' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Welcome Header with Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          {centerProfile.logo ? (
            <View style={styles.logoContainer}>
              <Image source={centerProfile.logo} style={styles.logo} />
            </View>
          ) : (
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoPlaceholderText}>🏠</Text>
            </View>
          )}
          <Text style={styles.centerName}>{centerProfile.name}</Text>
          <Text style={styles.greeting}>Welcome back! 👋</Text>
        </View>
      </LinearGradient>

      {/* Quick Statistics */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        <View style={styles.statsRow}>
          {stats.map(stat => (
            <View key={stat.label} style={[styles.statCard, { backgroundColor: stat.color }]}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Pending Requests Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleMain}>Pending Requests</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{pendingRequests.length}</Text>
          </View>
        </View>
        
        {pendingRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✨</Text>
            <Text style={styles.emptyText}>All caught up! No pending requests.</Text>
          </View>
        ) : (
          <View style={styles.pendingRequestsContainer}>
            <Text style={styles.pendingMessage}>
              You have {pendingRequests.length} pending parent request{pendingRequests.length > 1 ? 's' : ''} waiting for review.
            </Text>
            <TouchableOpacity
              style={styles.viewRequestsBtn}
              onPress={() => navigation.navigate('Request')}
            >
              <Text style={styles.viewRequestsBtnText}>📋 View All Pending Requests</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Center Info Snapshot */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Center Information</Text>
        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📍</Text>
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{centerProfile.location}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🕒</Text>
            <View>
              <Text style={styles.infoLabel}>Opening Hours</Text>
              <Text style={styles.infoValue}>{centerProfile.openingHours}</Text>
            </View>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>🏢</Text>
            <View>
              <Text style={styles.infoLabel}>Facilities</Text>
              <Text style={styles.infoValue}>{centerProfile.facilities} Available</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Announcements / Updates */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Latest Announcements</Text>
        {announcements.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📢</Text>
            <Text style={styles.emptyText}>No announcements yet.</Text>
          </View>
        ) : (
          announcements.map(a => (
            <View key={a.id} style={[styles.announcementCard, 
              a.priority === 'high' ? styles.highPriority : styles.normalPriority
            ]}>
              <View style={styles.announcementHeader}>
                <Text style={styles.announcementMessage}>{a.message}</Text>
                <Text style={styles.announcementDate}>{a.date}</Text>
              </View>
              {a.priority === 'high' && (
                <View style={styles.priorityBadge}>
                  <Text style={styles.priorityText}>Important</Text>
                </View>
              )}
            </View>
          ))
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitleMain}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity key={index} style={[styles.actionCard, { backgroundColor: action.color }]}>
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa' 
  },
  header: { 
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderRadius: 50,
    backgroundColor: '#fff',
    padding: 5,
  },
  logo: { 
    width: 90, 
    height: 90, 
    borderRadius: 45,
  },
  logoPlaceholder: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    backgroundColor: 'rgba(255,255,255,0.3)', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  logoPlaceholderText: {
    fontSize: 40,
  },
  centerName: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff',
    marginTop: 15,
    textAlign: 'center',
  },
  greeting: { 
    fontSize: 16, 
    color: 'rgba(255,255,255,0.9)',
    marginTop: 5,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingTop: 25,
  },
  statsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 15,
  },
  statCard: { 
    alignItems: 'center', 
    padding: 20, 
    borderRadius: 20, 
    width: (width - 60) / 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statIcon: { 
    fontSize: 30,
    marginBottom: 8,
  },
  statValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff',
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 11, 
    color: 'rgba(255,255,255,0.9)', 
    textAlign: 'center',
    fontWeight: '600',
  },
  section: { 
    marginHorizontal: 20, 
    marginTop: 25, 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  sectionTitleMain: { 
    fontSize: 18, 
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#ff4757',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: { 
    color: '#7f8c8d', 
    fontStyle: 'italic',
    fontSize: 16,
  },
  requestCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    backgroundColor: '#f8f9ff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  requestInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  childName: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  requestDate: { 
    color: '#95a5a6', 
    fontSize: 12,
  },
  reviewBtn: { 
    backgroundColor: '#00d2d3',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  reviewBtnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoGrid: {
    gap: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
  },
  editBtn: { 
    marginTop: 20,
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  editBtnText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  announcementCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  highPriority: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  normalPriority: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#74b9ff',
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  announcementMessage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  announcementDate: {
    fontSize: 12,
    color: '#95a5a6',
  },
  priorityBadge: {
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsGrid: {
    gap: 15,
  },
  actionCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  actionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 30,
  },
  pendingRequestsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pendingMessage: {
    fontSize: 16,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  viewRequestsBtn: {
    backgroundColor: '#667eea',
    borderRadius: 15,
    paddingHorizontal: 30,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  viewRequestsBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default HomeScreen;