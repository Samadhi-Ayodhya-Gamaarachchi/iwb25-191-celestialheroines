import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrolled Children</Text>
      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search child or parent..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No children found.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('ChildDetails', { childId: item.id })}
          >
            <View style={styles.row}>
              <Text style={styles.childName}>{item.name}</Text>
              <Text style={styles.age}>{item.ageYears} yrs</Text>
            </View>
            <Text style={styles.parentName}>👤 {item.parent.name}</Text>
            <Text style={styles.meta}>Enrolled: {item.enrolledAt}</Text>
            {item.allergies && item.allergies !== 'None' && (
              <Text style={styles.allergy}>Allergies: {item.allergies}</Text>
            )}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          // TODO: navigate to Add Child form
        }}
      >
        <Text style={styles.addBtnText}>➕ Add Child</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  searchBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e6ef'
  },
  searchInput: { fontSize: 15, paddingVertical: 6 },
  listContent: { paddingBottom: 120 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#666' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f2f6'
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  childName: { fontSize: 16, fontWeight: '600', color: '#2c3e50' },
  age: { fontSize: 14, fontWeight: '600', color: '#667eea' },
  parentName: { fontSize: 13, color: '#444', marginTop: 2 },
  meta: { fontSize: 11, color: '#888', marginTop: 4 },
  allergy: { fontSize: 12, color: '#e74c3c', marginTop: 6, fontWeight: '600' },
  addBtn: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#667eea',
    borderRadius: 28,
    paddingHorizontal: 24,
    paddingVertical: 14,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});

export default ChildrenListScreen;9