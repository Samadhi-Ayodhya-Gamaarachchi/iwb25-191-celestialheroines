import React from 'react';
import { View, Text } from 'react-native';
import { ChildData } from '../Health/HealthTypes';

interface GrowthTabProps {
  childData: ChildData;
}

const GrowthTab: React.FC<GrowthTabProps> = ({ childData }) => {
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📈</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Growth Progress</Text>
        </View>
        
        <View style={{
          backgroundColor: '#f8fafc',
          borderRadius: 12,
          padding: 32,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 180,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: '#e2e8f0'
        }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
          <Text style={{ 
            color: '#64748b', 
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4
          }}>
            Interactive growth chart coming soon!
          </Text>
          <Text style={{ 
            color: '#94a3b8', 
            textAlign: 'center',
            fontSize: 14
          }}>
            Track height and weight over time
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
          padding: 16
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>This Month</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#059669' }}>{childData.heightChange}</Text>
            <Text style={{ color: '#6b7280', fontSize: 11 }}>Height</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>This Month</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#059669' }}>{childData.weightChange}</Text>
            <Text style={{ color: '#6b7280', fontSize: 11 }}>Weight</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default GrowthTab;
