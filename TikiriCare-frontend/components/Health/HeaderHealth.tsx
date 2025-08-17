import React from 'react';
import { View, Text } from 'react-native';

const Header: React.FC = () => {
  return (
    <View style={{
      backgroundColor: 'white',
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '700',
          color: '#1f2937'
        }}>Health Tracker</Text>
      </View>
    </View>
  );
};

export default Header;