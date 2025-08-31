import React from 'react';
import { StyleSheet, View } from 'react-native';
import FooterNavigation from './_layout';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={styles.root}>
      <View style={styles.content}>{children}</View>
      <FooterNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFF' },
  content: { flex: 1 },
});

export default MainLayout;