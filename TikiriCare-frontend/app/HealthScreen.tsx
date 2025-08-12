import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import Header from '../components/Health/HeaderHealth';
import ChildDashboard from '../components/Health/ChildDashboard';
import NavigationTabs from '../components/Health/NavigationTab';
import GrowthTab from '../components/Health/GrowthTab';
import VaccinesTab from '../components/Health/VaccineTab';
import RecordsTab from '../components/Health/RecordTab';
import { 
  ChildData, 
  Vaccine, 
  MedicalRecord, 
  TabName 
} from '../components/Health/HealthTypes';

const HealthTracker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('Growth');

  const childData: ChildData = {
    name: 'Malith',
    age: '2y 3m',
    lastCheckup: 'July 25, 2025',
    height: 89,
    heightChange: '+2 cm',
    weight: 12.5,
    weightChange: '+0.4 kg',
    bmi: 15.8,
    bmiStatus: 'Normal'
  };

  const upcomingVaccines: Vaccine[] = [
    {
      id: 1,
      name: 'MMR Vaccine (2nd Dose)',
      description: 'Measles, Mumps, and Rubella',
      dueDate: 'Due Tomorrow',
      urgent: true
    },
    {
      id: 2,
      name: 'DTP Booster',
      description: 'Diphtheria, Tetanus, and Pertussis',
      dueDate: 'Due in 3 months',
      urgent: false
    }
  ];

  const medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      type: 'General Check-up',
      date: 'July 25, 2025',
      doctor: 'Dr. Perera',
      notes: 'Regular checkup, no issues detected. Growth and development on track.',
      status: 'completed',
      emoji: '✅'
    },
    {
      id: 2,
      type: 'Fever & Cold',
      date: 'May 12, 2025',
      doctor: 'Dr. Silva',
      notes: 'Mild fever and cold symptoms. Prescribed paracetamol and rest for 3 days.',
      status: 'recovered',
      emoji: '🤧'
    }
  ];

  const handleTabChange = (tab: TabName): void => {
    setActiveTab(tab);
  };

  const handlePrintRecord = (): void => {
    Alert.alert('Print Record', 'Vaccination record will be printed');
  };

  const handleRemindMe = (vaccineId: number): void => {
    const vaccine = upcomingVaccines.find(v => v.id === vaccineId);
    Alert.alert('Reminder Set', `Reminder set for ${vaccine?.name}`);
  };

  const handleExport = (): void => {
    Alert.alert('Export Records', 'Medical records will be exported');
  };

  const renderTabContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'Growth':
        return <GrowthTab childData={childData} />;
      case 'Vaccines':
        return (
          <VaccinesTab 
            vaccines={upcomingVaccines}
            onPrintRecord={handlePrintRecord}
            onRemindMe={handleRemindMe}
          />
        );
      case 'Records':
        return (
          <RecordsTab 
            records={medicalRecords}
            onExport={handleExport}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <Header />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          <ChildDashboard childData={childData} />
          
          <NavigationTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HealthTracker;