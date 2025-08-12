import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import HeaderSection from '../components/Home/Header';
import ChildInfoCard from '../components/Home/ChildInfo';
import DevelopmentProgress from '../components/Home/DevelopmentProgress';
import UpcomingVaccines from '../components/Home/UpcommingVac';
import CareTips from '../components/Home/CareTips';
import QuickActions from '../components/Home/QuickActions';

import { 
  ChildData, 
  DevelopmentMilestone, 
  Vaccine, 
  CareTip, 
  SummaryItem 
} from '../components/Home/HomeType';

const HealthTrackerHome: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);

  const childData: ChildData = {
    name: 'Malith',
    age: '2y 3m',
    lastCheckup: 'July 25, 2025',
    height: 89,
    weight: 12.5,
    bmi: 15.8,
    developmentScore: 85
  };

  const developmentMilestones: DevelopmentMilestone[] = [
    { category: 'Physical', progress: 90, color: 'green-500', emoji: '🏃' },
    { category: 'Cognitive', progress: 85, color: 'purple-500', emoji: '🧠' },
    { category: 'Language', progress: 80, color: 'cyan-500', emoji: '🗣️' },
    { category: 'Social', progress: 88, color: 'amber-500', emoji: '👫' }
  ];

  const upcomingVaccines: Vaccine[] = [
    {
      id: 1,
      name: 'MMR (2nd Dose)',
      dueDate: 'Tomorrow',
      urgent: true,
      emoji: '💉'
    },
    {
      id: 2,
      name: 'DTP Booster',
      dueDate: 'In 3 months',
      urgent: false,
      emoji: '🏥'
    }
  ];

  const careTips: CareTip[] = [
    {
      id: 1,
      title: 'Language Development',
      tip: 'Read stories together daily. At 2y 3m, children should know 50+ words and start combining them.',
      emoji: '📚',
      category: 'Development'
    },
    {
      id: 2,
      title: 'Nutrition Focus',
      tip: 'Offer variety of foods. Toddlers need calcium for bone growth - include dairy, leafy greens.',
      emoji: '🥛',
      category: 'Nutrition'
    },
    {
      id: 3,
      title: 'Sleep Schedule',
      tip: 'Maintain 11-14 hours total sleep. Consistent bedtime routine helps brain development.',
      emoji: '😴',
      category: 'Sleep'
    },
    {
      id: 4,
      title: 'Physical Activity',
      tip: 'Encourage running, jumping, climbing. Physical play develops motor skills and coordination.',
      emoji: '⚽',
      category: 'Activity'
    },
    {
      id: 5,
      title: 'Social Skills',
      tip: 'Arrange playdates with other children. This age learns sharing and taking turns.',
      emoji: '👶',
      category: 'Social'
    }
  ];

  const summaryData: SummaryItem[] = [
    { emoji: '💧', label: 'Water', value: '6/8 cups' },
    { emoji: '🍎', label: 'Meals', value: '3/3 today' },
    { emoji: '😴', label: 'Sleep', value: '12h 30m' },
    { emoji: '🎮', label: 'Play', value: '2h 15m' }
  ];

  const nextTip = (): void => {
    setCurrentTipIndex((prev) => (prev + 1) % careTips.length);
  };

  const prevTip = (): void => {
    setCurrentTipIndex((prev) => (prev - 1 + careTips.length) % careTips.length);
  };

  const handleLogGrowth = (): void => {
    Alert.alert('Log Growth', 'Navigate to growth tracking screen');
  };

  const handleAddMedicine = (): void => {
    Alert.alert('Add Medicine', 'Navigate to medicine management screen');
  };

  const handleBookCheckup = (): void => {
    Alert.alert('Book Checkup', 'Navigate to appointment booking screen');
  };

  return (
    <ScrollView className="bg-gray-50 min-h-full max-w-md mx-auto">
      <HeaderSection childName={childData.name} />
      
      <View className="px-5 pb-8">
        <ChildInfoCard childData={childData} />
        
        <DevelopmentProgress 
          milestones={developmentMilestones} 
          developmentScore={childData.developmentScore} 
        />
        
        <UpcomingVaccines vaccines={upcomingVaccines} />
        
        <CareTips 
          careTips={careTips}
          currentTipIndex={currentTipIndex}
          onNext={nextTip}
          onPrevious={prevTip}
        />
        
        <QuickActions 
          onLogGrowth={handleLogGrowth}
          onAddMedicine={handleAddMedicine}
          onBookCheckup={handleBookCheckup}
        />
        
        
      </View>
    </ScrollView>
  );
};

export default HealthTrackerHome;