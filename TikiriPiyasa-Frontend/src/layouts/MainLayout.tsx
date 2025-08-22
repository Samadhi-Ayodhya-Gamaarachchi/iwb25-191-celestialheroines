import React from 'react';
import { StyleSheet, View } from 'react-native';
import FooterNavigation from './_layout';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <FooterNavigation />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default MainLayout;