import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MedicalRecord } from '../Health/HealthTypes';

interface RecordsTabProps {
  records: MedicalRecord[];
  onExport?: () => void;
}

const RecordsTab: React.FC<RecordsTabProps> = ({ records, onExport }) => {
  const getStatusColor = (status: MedicalRecord['status']) => {
    switch (status) {
      case 'completed':
        return { bg: '#10b981', iconBg: '#d1fae5' };
      case 'recovered':
        return { bg: '#f59e0b', iconBg: '#fef3c7' };
      case 'ongoing':
        return { bg: '#3b82f6', iconBg: '#dbeafe' };
      default:
        return { bg: '#6b7280', iconBg: '#f3f4f6' };
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📋</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Medical History</Text>
        </View>
        <TouchableOpacity 
          onPress={onExport}
          style={{
            backgroundColor: '#10b981',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <Text style={{ marginRight: 4, color: 'white' }}>⬇️</Text>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Export</Text>
        </TouchableOpacity>
      </View>
      
      {records.map((record) => {
        const colors = getStatusColor(record.status);
        return (
          <View key={record.id} style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            borderLeftWidth: 4,
            borderLeftColor: colors.bg
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View style={{
                width: 40,
                height: 40,
                backgroundColor: colors.iconBg,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12
              }}>
                <Text style={{ fontSize: 18 }}>{record.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontWeight: '700',
                  color: '#1f2937',
                  fontSize: 16,
                  marginBottom: 4
                }}>{record.type}</Text>
                <Text style={{
                  color: '#6b7280',
                  fontSize: 13,
                  marginBottom: 8,
                  fontWeight: '500'
                }}>📅 {record.date} • 👨‍⚕️ {record.doctor}</Text>
                <Text style={{
                  color: '#4b5563',
                  fontSize: 14,
                  lineHeight: 20
                }}>{record.notes}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default RecordsTab;