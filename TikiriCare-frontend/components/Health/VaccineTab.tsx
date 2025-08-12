import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Vaccine } from '../Health/HealthTypes';

interface VaccinesTabProps {
  vaccines: Vaccine[];
  onPrintRecord?: () => void;
  onRemindMe?: (vaccineId: number) => void;
}

const VaccinesTab: React.FC<VaccinesTabProps> = ({ 
  vaccines, 
  onPrintRecord, 
  onRemindMe 
}) => {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>💉</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Vaccination Schedule</Text>
        </View>
    
      </View>
      
      {vaccines.map((vaccine) => (
        <View key={vaccine.id} style={{
          backgroundColor: vaccine.urgent ? '#fef2f2' : '#eff6ff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 2,
          borderColor: vaccine.urgent ? '#fecaca' : '#bfdbfe',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <View style={{
              backgroundColor: vaccine.urgent ? '#ef4444' : '#3b82f6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{ marginRight: 4, fontSize: 12 }}>
                {vaccine.urgent ? '⚠️' : '📅'}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '600'
              }}>
                {vaccine.dueDate}
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => onRemindMe?.(vaccine.id)}
              style={{
                backgroundColor: '#3b82f6',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text style={{ marginRight: 4 }}>🔔</Text>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Remind Me</Text>
            </TouchableOpacity>
          </View>
          <Text style={{
            fontWeight: '700',
            color: '#1f2937',
            fontSize: 16,
            marginBottom: 4
          }}>{vaccine.name}</Text>
          <Text style={{
            color: '#6b7280',
            fontSize: 14
          }}>{vaccine.description}</Text>
        </View>
      ))}
    </View>
  );
};

export default VaccinesTab;