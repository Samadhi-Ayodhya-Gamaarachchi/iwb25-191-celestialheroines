import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import type { RootStackParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

export interface ParentInfo {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface ChildInfo {
  id: string;
  name: string;
  ageYears: number;
  dob: string;
  allergies?: string;
  notes?: string;
  parent: ParentInfo;
  enrolledAt: string;
}

type Nav = NativeStackNavigationProp<RootStackParamList, 'Children'>;

const ChildrenListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [search, setSearch] = useState('');
  const [children] = useState<ChildInfo[]>([
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
      enrolledAt: '2024-01-21',
      parent: {
        id: 'p2',
        name: 'Michael Brown',
        email: 'michael@example.com',
        phone: '+94 77 987 6543'
      }
    }
  ]);

  const filtered = useMemo(
    () =>
      children.filter(c =>
        (c.name + c.parent.name).toLowerCase().includes(search.toLowerCase())
      ),
    [children, search]
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (id: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const index = id.charCodeAt(0) % colors.length;
    return colors[index];
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>👶 Enrolled Children</Text>
          <Text style={styles.headerSubtitle}>
            {children.length} children currently enrolled
          </Text>
        </View>
      </LinearGradient>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{children.length}</Text>
          <Text style={styles.statLabel}>Total Children</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {children.filter(c => c.allergies && c.allergies !== 'None').length}
          </Text>
          <Text style={styles.statLabel}>With Allergies</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {new Set(children.map(c => c.parent.id)).size}
          </Text>
          <Text style={styles.statLabel}>Unique Parents</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search child or parent name..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Children List */}
      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👶</Text>
            <Text style={styles.emptyTitle}>No children found</Text>
            <Text style={styles.emptyText}>
              {search ? 'Try adjusting your search terms' : 'No children enrolled yet'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.childCard}
            onPress={() => navigation.navigate('ChildDetails', { childId: item.id })}
            activeOpacity={0.7}
          >
            {/* Child Avatar & Basic Info */}
            <View style={styles.cardHeader}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.id) }]}>
                  <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
                </View>
                <View style={styles.ageTag}>
                  <Text style={styles.ageText}>{item.ageYears}</Text>
                </View>
              </View>

              <View style={styles.childInfo}>
                <Text style={styles.childName}>{item.name}</Text>
                <Text style={styles.parentName}>👤 {item.parent.name}</Text>
                <Text style={styles.enrolledDate}>📅 Enrolled: {item.enrolledAt}</Text>
              </View>

              <Text style={styles.viewArrow}>→</Text>
            </View>

            {/* Allergies Warning */}
            {item.allergies && item.allergies !== 'None' && (
              <View style={styles.allergyWarning}>
                <Text style={styles.allergyIcon}>⚠️</Text>
                <Text style={styles.allergyText}>Allergic to: {item.allergies}</Text>
              </View>
            )}

            {/* Notes Preview */}
            {item.notes && (
              <View style={styles.notesPreview}>
                <Text style={styles.notesIcon}>📝</Text>
                <Text style={styles.notesText} numberOfLines={1}>
                  {item.notes}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF'
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  statCard: {
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 15,
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
    color: '#666',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 5,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  ageTag: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: '#667eea',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  ageText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  parentName: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    marginBottom: 2,
  },
  enrolledDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  viewArrow: {
    fontSize: 20,
    color: '#667eea',
    fontWeight: 'bold',
  },
  allergyWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#E74C3C',
  },
  allergyIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  allergyText: {
    fontSize: 13,
    color: '#E74C3C',
    fontWeight: '600',
    flex: 1,
  },
  notesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#667eea',
  },
  notesIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  notesText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChildrenListScreen;