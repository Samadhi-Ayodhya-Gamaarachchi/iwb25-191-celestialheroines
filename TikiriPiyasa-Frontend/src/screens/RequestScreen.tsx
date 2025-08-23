import type { RouteProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

type ReqRoute = RouteProp<RootStackParamList, 'Request'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Request'>;

interface RequestData {
  id: number;
  parentName: string;
  childName: string;
  childAge: number;
  childDob: string;
  allergies: string;
  extraNotes: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  parentEmail: string;
  parentPhone: string;
}

const RequestScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  // Sample data - replace with API call
  const [requests, setRequests] = useState<RequestData[]>([
    {
      id: 1,
      parentName: 'Sarah Johnson',
      childName: 'Emma Johnson',
      childAge: 3,
      childDob: '2021-03-15',
      allergies: 'Peanuts, Dairy',
      extraNotes: 'Very shy child, needs extra attention during meals',
      requestDate: '2024-01-15',
      status: 'pending',
      parentEmail: 'sarah.j@email.com',
      parentPhone: '+94 77 123 4567'
    },
    {
      id: 2,
      parentName: 'Michael Brown',
      childName: 'Alex Brown',
      childAge: 4,
      childDob: '2020-07-22',
      allergies: 'None',
      extraNotes: 'Loves drawing and music activities',
      requestDate: '2024-01-16',
      status: 'accepted',
      parentEmail: 'mike.brown@email.com',
      parentPhone: '+94 77 987 6543'
    },
    {
      id: 3,
      parentName: 'Lisa Davis',
      childName: 'Sophie Davis',
      childAge: 2,
      childDob: '2022-01-10',
      allergies: 'Shellfish',
      extraNotes: 'Still learning potty training, needs reminders',
      requestDate: '2024-01-14',
      status: 'rejected',
      parentEmail: 'lisa.davis@email.com',
      parentPhone: '+94 77 555 1234'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Filter and search logic
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.childName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || req.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F39C12';
      case 'accepted': return '#27AE60';
      case 'rejected': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'rejected': return '❌';
      default: return '📝';
    }
  };

  const handleAction = (requestId: number, action: 'accept' | 'reject') => {
    Alert.alert(
      `${action === 'accept' ? 'Accept' : 'Reject'} Request`,
      `Are you sure you want to ${action} this request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action === 'accept' ? 'Accept' : 'Reject',
          style: action === 'accept' ? 'default' : 'destructive',
          onPress: () => {
            setRequests(prev => prev.map(req =>
              req.id === requestId
                ? { ...req, status: action === 'accept' ? 'accepted' : 'rejected' }
                : req
            ));
            setShowDetailModal(false);
            Alert.alert('Success', `Request ${action}ed successfully!`);
          }
        }
      ]
    );
  };

  const openDetailModal = (request: RequestData) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const renderFilterButton = (filter: typeof filterStatus, label: string, count: number) => {
    const isActive = filterStatus === filter;
    return (
      <TouchableOpacity
        style={[styles.filterBtn, isActive && styles.activeFilterBtn]}
        onPress={() => setFilterStatus(filter)}
      >
        <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
          {label} ({count})
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRequestCard = ({ item }: { item: RequestData }) => (
    <TouchableOpacity
      style={styles.requestCard}
      onPress={() => openDetailModal(item)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.requestInfo}>
          <Text style={styles.parentName}>{item.parentName}</Text>
          <Text style={styles.childInfo}>
            👶 {item.childName} ({item.childAge} years old)
          </Text>
          <Text style={styles.requestDate}>📅 {item.requestDate}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusIcon}>{getStatusIcon(item.status)}</Text>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>

      {item.extraNotes && (
        <View style={styles.notesSection}>
          <Text style={styles.notesLabel}>📝 Notes:</Text>
          <Text style={styles.notesText} numberOfLines={2}>{item.extraNotes}</Text>
        </View>
      )}

      {item.status === 'pending' && (
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.acceptBtn]}
            onPress={() => handleAction(item.id, 'accept')}
          >
            <Text style={styles.quickActionText}>✅ Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickActionBtn, styles.rejectBtn]}
            onPress={() => handleAction(item.id, 'reject')}
          >
            <Text style={styles.quickActionText}>❌ Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderDetailModal = () => (
    <Modal
      visible={showDetailModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowDetailModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedRequest && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Request Details</Text>
                  <TouchableOpacity
                    style={styles.closeBtn}
                    onPress={() => setShowDetailModal(false)}
                  >
                    <Text style={styles.closeText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>👤 Parent Information</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.parentName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Email:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.parentEmail}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Phone:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.parentPhone}</Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>👶 Child Information</Text>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Name:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.childName}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Age:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.childAge} years old</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Date of Birth:</Text>
                    <Text style={styles.detailValue}>{selectedRequest.childDob}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailKey}>Allergies:</Text>
                    <Text style={[styles.detailValue,
                      selectedRequest.allergies === 'None' ? styles.noAllergies : styles.hasAllergies
                    ]}>
                      {selectedRequest.allergies}
                    </Text>
                  </View>
                </View>

                {selectedRequest.extraNotes && (
                  <View style={styles.detailSection}>
                    <Text style={styles.detailLabel}>📝 Additional Notes</Text>
                    <Text style={styles.notesDetail}>{selectedRequest.extraNotes}</Text>
                  </View>
                )}

                <View style={styles.statusSection}>
                  <Text style={styles.detailLabel}>📊 Request Status</Text>
                  <View style={[styles.currentStatus, { backgroundColor: getStatusColor(selectedRequest.status) }]}>
                    <Text style={styles.currentStatusText}>
                      {getStatusIcon(selectedRequest.status)} {selectedRequest.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {selectedRequest.status === 'pending' && (
                  <View style={styles.modalActions}>
                    <TouchableOpacity
                      style={[styles.modalActionBtn, styles.modalAcceptBtn]}
                      onPress={() => handleAction(selectedRequest.id, 'accept')}
                    >
                      <Text style={styles.modalActionText}>✅ Accept Request</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.modalActionBtn, styles.modalRejectBtn]}
                      onPress={() => handleAction(selectedRequest.id, 'reject')}
                    >
                      <Text style={styles.modalActionText}>❌ Reject Request</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const getFilterCounts = () => {
    return {
      all: requests.length,
      pending: requests.filter(r => r.status === 'pending').length,
      accepted: requests.filter(r => r.status === 'accepted').length,
      rejected: requests.filter(r => r.status === 'rejected').length
    };
  };

  const counts = getFilterCounts();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent Requests</Text>
        <Text style={styles.headerSubtitle}>Review and manage enrollment requests</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by parent or child name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All', counts.all)}
        {renderFilterButton('pending', 'Pending', counts.pending)}
        {renderFilterButton('accepted', 'Accepted', counts.accepted)}
        {renderFilterButton('rejected', 'Rejected', counts.rejected)}
      </View>

      {/* Requests List */}
      <FlatList
        data={filteredRequests}
        renderItem={renderRequestCard}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Try adjusting your search terms' : 'No requests match the selected filter'}
            </Text>
          </View>
        }
      />

      {/* Detail Modal */}
      {renderDetailModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F5F7FA',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  activeFilterBtn: {
    backgroundColor: '#667eea',
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  requestInfo: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  childInfo: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  notesSection: {
    backgroundColor: '#F8FAFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  acceptBtn: {
    backgroundColor: '#27AE60',
  },
  rejectBtn: {
    backgroundColor: '#E74C3C',
  },
  quickActionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 50,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  detailSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailKey: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  noAllergies: {
    color: '#27AE60',
  },
  hasAllergies: {
    color: '#E74C3C',
    fontWeight: 'bold',
  },
  notesDetail: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    backgroundColor: '#F8FAFF',
    padding: 15,
    borderRadius: 10,
  },
  statusSection: {
    padding: 20,
  },
  currentStatus: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  currentStatusText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalActionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalAcceptBtn: {
    backgroundColor: '#27AE60',
  },
  modalRejectBtn: {
    backgroundColor: '#E74C3C',
  },
  modalActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RequestScreen;