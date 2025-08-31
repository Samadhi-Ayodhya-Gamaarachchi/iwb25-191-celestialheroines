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
  { id: 'Children', label: 'Children', icon: 'people-outline', activeIcon: 'people' }, // NEW -> navigates to ChildrenListScreen
  { id: 'Request', label: 'Requests', icon: 'document-text-outline', activeIcon: 'document-text' },
  { id: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
];

const NUMBER = 2; // Example number for badge

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
                {tab.id === 'Request' && NUMBER > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{NUMBER}</Text>
                  </View>
                )}
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
  badge: {
    position: 'absolute',
    top: 2,
    right: 10,
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingHorizontal: 5,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default FooterNavigation;