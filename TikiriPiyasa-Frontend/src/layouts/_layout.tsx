import { useNavigation, useNavigationState } from '@react-navigation/native';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const tabs = [
  { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
  { id: 'Search', label: 'Search', icon: 'search-outline', activeIcon: 'search' },
  { id: 'Cart', label: 'Cart', icon: 'bag-outline', activeIcon: 'bag' },
  { id: 'Orders', label: 'Orders', icon: 'receipt-outline', activeIcon: 'receipt' },
  { id: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const FooterNavigation: React.FC = () => {
  const navigation = useNavigation();
  const currentRouteName = useNavigationState((state) => {
    const getActive = (s: any): string => {
      const route = s.routes[s.index];
      if (route.state) return getActive(route.state);
      return route.name;
    };
    return getActive(state);
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
            const isActive = currentRouteName === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={styles.tabItem}
                onPress={() => navigation.navigate(tab.id as never)}
                activeOpacity={0.7}
              >
                <Icon
                  name={isActive ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isActive ? '#4CAF50' : '#757575'}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isActive ? '#4CAF50' : '#757575' },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default FooterNavigation;