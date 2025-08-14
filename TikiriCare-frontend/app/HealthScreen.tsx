import React, { useState } from 'react';
import {
   View,
   ScrollView,
   SafeAreaView,
  StatusBar,
  Alert,
  Text
} from 'react-native';
import Header from '../components/Health/HeaderHealth';
import ChildDashboard from '../components/Health/ChildDashboard';
import NavigationTabs from '../components/Health/NavigationTab';
import GrowthTab from '../components/Health/GrowthTab';
import VaccinesTab from '../components/Health/VaccineTab';
import RecordsTab from '../components/Health/RecordTab';
import { useChild } from '../context/ChildContext';
import {
   ChildData,
   Vaccine,
   MedicalRecord,
   TabName
 } from '../components/Health/HealthTypes';

const HealthTracker: React.FC = () => {
  const { selectedChild } = useChild();
  const [activeTab, setActiveTab] = useState<TabName>('Growth');

  // If no child is selected, show a message
  if (!selectedChild) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
        <Header />
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: 20,
          backgroundColor: '#f8fafc'
        }}>
          <Text style={{ 
            fontSize: 20, 
            fontWeight: '600',
            color: '#374151', 
            textAlign: 'center',
            marginBottom: 8
          }}>
            No Child Selected
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: '#6B7280', 
            textAlign: 'center',
            lineHeight: 24
          }}>
            Please select a child from your profile to view their health tracking information.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Use selected child's data
  const childData: ChildData = {
    name: selectedChild.name,
    age: selectedChild.age,
    lastCheckup: selectedChild.lastCheckup || 'Not scheduled',
    height: selectedChild.height || 0,
    heightChange: selectedChild.heightChange || '+0 cm',
    weight: selectedChild.weight || 0,
    weightChange: selectedChild.weightChange || '+0 kg',
    bmi: selectedChild.bmi || 0,
    bmiStatus: selectedChild.bmiStatus || 'Normal'
  };

  // Generate age-appropriate vaccines
  const getAgeVaccines = (age: string): Vaccine[] => {
    const ageMatch = age.match(/(\d+)y/);
    const years = ageMatch ? parseInt(ageMatch[1]) : 2;

    if (years <= 2) {
      return [
        {
          id: 1,
          name: 'MMR Vaccine (1st Dose)',
          description: 'Measles, Mumps, and Rubella',
          dueDate: 'Due Next Week',
          urgent: true
        },
        {
          id: 2,
          name: 'DTP Series',
          description: 'Diphtheria, Tetanus, and Pertussis',
          dueDate: 'Due in 2 months',
          urgent: false
        },
        {
          id: 3,
          name: 'Polio Vaccine',
          description: 'Oral Polio Vaccine',
          dueDate: 'Due in 3 months',
          urgent: false
        }
      ];
    } else if (years <= 4) {
      return [
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
    } else {
      return [
        {
          id: 1,
          name: 'School Entry Vaccines',
          description: 'Required vaccinations for school',
          dueDate: 'Due before school starts',
          urgent: true
        },
        {
          id: 2,
          name: 'Annual Flu Shot',
          description: 'Seasonal influenza vaccine',
          dueDate: 'Due annually',
          urgent: false
        }
      ];
    }
  };

  // Generate medical records for the selected child
  const getMedicalRecords = (child: typeof selectedChild): MedicalRecord[] => {
    return [
      {
        id: 1,
        type: 'General Check-up',
        date: child.lastCheckup || 'July 25, 2025',
        doctor: 'Dr. Perera',
        notes: `Regular checkup for ${child.name}. Growth and development on track. Height: ${child.height}cm, Weight: ${child.weight}kg.`,
        status: 'completed',
        emoji: '✅'
      },
      {
        id: 2,
        type: 'Vaccination',
        date: 'June 15, 2025',
        doctor: 'Dr. Silva',
        notes: `Administered routine vaccinations for ${child.name}. Child tolerated well with no adverse reactions.`,
        status: 'completed',
        emoji: '💉'
      },
      {
        id: 3,
        type: 'Growth Monitoring',
        date: 'May 30, 2025',
        doctor: 'Dr. Perera',
        notes: `Growth assessment for ${child.name}. ${child.heightChange || 'Height stable'}, ${child.weightChange || 'Weight stable'}. BMI: ${child.bmi} (${child.bmiStatus || 'Normal'}).`,
        status: 'completed',
        emoji: '📏'
      }
    ];
  };

  const upcomingVaccines = getAgeVaccines(selectedChild.age);
  const medicalRecords = getMedicalRecords(selectedChild);

  const handleTabChange = (tab: TabName): void => {
    setActiveTab(tab);
  };

  const handlePrintRecord = (): void => {
    Alert.alert('Print Record', `Vaccination record for ${selectedChild.name} will be printed`);
  };

  const handleRemindMe = (vaccineId: number): void => {
    const vaccine = upcomingVaccines.find(v => v.id === vaccineId);
    Alert.alert('Reminder Set', `Reminder set for ${vaccine?.name} - ${selectedChild.name}`);
  };

  const handleExport = (): void => {
    Alert.alert('Export Records', `Medical records for ${selectedChild.name} will be exported`);
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