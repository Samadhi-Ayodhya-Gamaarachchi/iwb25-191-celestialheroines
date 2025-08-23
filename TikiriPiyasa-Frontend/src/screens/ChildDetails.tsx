import type { RouteProp } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { RootStackParamList } from '../navigation/types';

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
        <Text style={styles.errorText}>Child not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backLink}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleRemove = () => {
    Alert.alert('Remove Child', 'Are you sure you want to unenroll this child?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{child.name}</Text>
      <View style={styles.badgesRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{child.ageYears} yrs</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: '#45b7d1' }]}>
          <Text style={styles.badgeText}>Enrolled {child.enrolledAt}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Child Information</Text>
        <Detail label="Name" value={child.name} />
        <Detail label="Date of Birth" value={child.dob} />
        <Detail label="Allergies" value={child.allergies || 'None'} valueStyle={child.allergies && child.allergies !== 'None' ? styles.alertValue : styles.safeValue}/>
        {child.notes && <Detail label="Notes" value={child.notes} multiline />}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Parent / Guardian</Text>
        <Detail label="Name" value={child.parent.name} />
        <Detail label="Email" value={child.parent.email} />
        <Detail label="Phone" value={child.parent.phone} />
        {child.parent.address && <Detail label="Address" value={child.parent.address} />}
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => Alert.alert('Edit (stub)')}>
          <Text style={styles.primaryBtnText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.dangerBtn} onPress={handleRemove}>
          <Text style={styles.dangerBtnText}>🗑 Remove</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.backWrapper} onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Children</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const Detail: React.FC<{
  label: string;
  value: string;
  multiline?: boolean;
  valueStyle?: any;
}> = ({ label, value, multiline, valueStyle }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text
      style={[styles.detailValue, valueStyle]}
      numberOfLines={multiline ? undefined : 1}
    >
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 120 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 10, color: '#2c3e50' },
  badgesRow: { flexDirection: 'row', marginBottom: 18 },
  badge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f0f2f6'
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, color: '#34495e' },
  detailRow: { marginBottom: 10 },
  detailLabel: { fontSize: 11, fontWeight: '600', color: '#88919c', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: '500', color: '#2c3e50', lineHeight: 20 },
  alertValue: { color: '#e74c3c', fontWeight: '700' },
  safeValue: { color: '#27ae60' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#667eea',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginRight: 8
  },
  primaryBtnText: { color: '#fff', fontWeight: '700' },
  dangerBtn: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginLeft: 8
  },
  dangerBtnText: { color: '#fff', fontWeight: '700' },
  backWrapper: { marginTop: 24, alignItems: 'center' },
  backLink: { color: '#667eea', fontWeight: '600' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { fontSize: 16, color: '#e74c3c', marginBottom: 20 }
});

export default ChildDetails;