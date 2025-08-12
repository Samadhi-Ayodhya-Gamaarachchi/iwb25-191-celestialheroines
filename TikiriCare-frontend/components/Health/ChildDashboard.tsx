import React from 'react';
import { View, Text } from 'react-native';
import { ChildData } from '../Health/HealthTypes';

interface ChildDashboardProps {
  childData: ChildData;
}

const ChildDashboard: React.FC<ChildDashboardProps> = ({ childData }) => {
  return (
    <View style={{
      backgroundColor: '#6366f1',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 16
    }}>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Text style={{ fontSize: 28, marginRight: 12 }}>👶</Text>
        <View>
          <Text style={{
            fontSize: 22,
            fontWeight: '800',
            color: 'white'
          }}>
            {childData.name} ({childData.age})
          </Text>
          <Text style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            fontWeight: '500'
          }}>
            Last check-up: {childData.lastCheckup}
          </Text>
        </View>
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 12, 
            marginBottom: 6,
            fontWeight: '500'
          }}>Height</Text>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '800', 
            color: 'white',
            marginBottom: 4
          }}>{childData.height} cm</Text>
          <View style={{
            backgroundColor: '#10b981',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 11, 
              fontWeight: '700'
            }}>{childData.heightChange}</Text>
          </View>
        </View>
        
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 12, 
            marginBottom: 6,
            fontWeight: '500'
          }}>Weight</Text>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '800', 
            color: 'white',
            marginBottom: 4
          }}>{childData.weight} kg</Text>
          <View style={{
            backgroundColor: '#10b981',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 11, 
              fontWeight: '700'
            }}>{childData.weightChange}</Text>
          </View>
        </View>
        
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={{ 
            color: 'rgba(255,255,255,0.7)', 
            fontSize: 12, 
            marginBottom: 6,
            fontWeight: '500'
          }}>BMI</Text>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '800', 
            color: 'white',
            marginBottom: 4
          }}>{childData.bmi}</Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10
          }}>
            <Text style={{ 
              color: 'white', 
              fontSize: 11, 
              fontWeight: '700'
            }}>{childData.bmiStatus}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChildDashboard;