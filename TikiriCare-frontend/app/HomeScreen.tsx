import React, { useState } from 'react';
import { ScrollView, View, Alert, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import HeaderSection from '../components/Home/Header';
import ChildInfoCard from '../components/Home/ChildInfo';
import DevelopmentProgress from '../components/Home/DevelopmentProgress';
import UpcomingVaccines from '../components/Home/UpcommingVac';
import CareTips from '../components/Home/CareTips';
import QuickActions from '../components/Home/QuickActions';
import AddGrowthModal from '../components/Home/AddGrowth'; // Import the modal
import { useChild } from '../context/ChildContext';

import { 
  ChildData, 
  DevelopmentMilestone, 
  Vaccine, 
  CareTip, 
  SummaryItem 
} from '../components/Home/HomeType';

const HealthTrackerHome: React.FC = () => {
  const { selectedChild, children } = useChild();
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [showGrowthModal, setShowGrowthModal] = useState<boolean>(false); // Add modal state

  // If no children exist, show add child prompt
  if (children.length === 0) {
    return (
      <ScrollView className="bg-gray-50 min-h-full max-w-md mx-auto">
        <View className="px-5 py-8 items-center justify-center min-h-screen">
          <Text className="text-6xl mb-4">👶</Text>
          <Text className="text-xl font-semibold text-gray-700 text-center mb-4">
            Welcome to TikiriCare!
          </Text>
          <Text className="text-base text-gray-600 text-center mb-8">
            Start by adding your child's information to track their health and development.
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/Add_child')}
            className="bg-blue-500 px-6 py-3 rounded-full"
          >
            <Text className="text-white font-semibold text-base">Add Your First Child</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // If no child is selected, show a message
  if (!selectedChild) {
    return (
      <ScrollView className="bg-gray-50 min-h-full max-w-md mx-auto">
        <View className="px-5 py-8 items-center justify-center min-h-screen">
          <Text className="text-xl font-semibold text-gray-700 text-center mb-4">
            No Child Selected
          </Text>
          <Text className="text-base text-gray-600 text-center">
            Please select a child from your profile to view their health information.
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Use selected child's data
  const childData: ChildData = {
    name: selectedChild.name,
    age: selectedChild.age,
    lastCheckup: selectedChild.lastCheckup || 'Not scheduled',
    height: selectedChild.height || 0,
    weight: selectedChild.weight || 0,
    bmi: selectedChild.bmi || 0,
    developmentScore: selectedChild.developmentScore || 0
  };

  // Generate age-appropriate development milestones
  const getAgeMilestones = (age: string): DevelopmentMilestone[] => {
    const ageMatch = age.match(/(\d+)y/);
    const years = ageMatch ? parseInt(ageMatch[1]) : 2;

    if (years <= 2) {
      return [
        { category: 'Physical', progress: 85, color: 'green-500', emoji: '🚶' },
        { category: 'Cognitive', progress: selectedChild.developmentScore || 80, color: 'purple-500', emoji: '🧠' },
        { category: 'Language', progress: 75, color: 'cyan-500', emoji: '🗣️' },
        { category: 'Social', progress: 82, color: 'amber-500', emoji: '👶' }
      ];
    } else if (years <= 4) {
      return [
        { category: 'Physical', progress: 90, color: 'green-500', emoji: '🏃' },
        { category: 'Cognitive', progress: selectedChild.developmentScore || 85, color: 'purple-500', emoji: '🧠' },
        { category: 'Language', progress: 88, color: 'cyan-500', emoji: '🗣️' },
        { category: 'Social', progress: 92, color: 'amber-500', emoji: '👫' }
      ];
    } else {
      return [
        { category: 'Physical', progress: 93, color: 'green-500', emoji: '⚽' },
        { category: 'Cognitive', progress: selectedChild.developmentScore || 90, color: 'purple-500', emoji: '🧠' },
        { category: 'Language', progress: 95, color: 'cyan-500', emoji: '📚' },
        { category: 'Social', progress: 90, color: 'amber-500', emoji: '🤝' }
      ];
    }
  };

  // Generate age-appropriate vaccines
  const getAgeVaccines = (age: string): Vaccine[] => {
    const ageMatch = age.match(/(\d+)y/);
    const years = ageMatch ? parseInt(ageMatch[1]) : 2;

    if (years <= 2) {
      return [
        {
          id: 1,
          name: 'MMR (1st Dose)',
          dueDate: 'Due Next Week',
          urgent: true,
          emoji: '💉'
        },
        {
          id: 2,
          name: 'DTP Series',
          dueDate: 'In 2 months',
          urgent: false,
          emoji: '🏥'
        }
      ];
    } else if (years <= 4) {
      return [
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
    } else {
      return [
        {
          id: 1,
          name: 'School Entry Vaccines',
          dueDate: 'Before School Starts',
          urgent: true,
          emoji: '🎒'
        }
      ];
    }
  };

  // Generate age-appropriate care tips
  const getAgeTips = (age: string): CareTip[] => {
    const ageMatch = age.match(/(\d+)y/);
    const years = ageMatch ? parseInt(ageMatch[1]) : 2;

    if (years <= 2) {
      return [
        {
          id: 1,
          title: 'Language Development',
          tip: `At ${age}, children should know 50+ words and start combining them. Read stories together daily.`,
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
        }
      ];
    } else if (years <= 4) {
      return [
        {
          id: 1,
          title: 'Preschool Skills',
          tip: `At ${age}, focus on counting, colors, and shapes. Encourage independent play and creativity.`,
          emoji: '🎨',
          category: 'Development'
        },
        {
          id: 2,
          title: 'Social Development',
          tip: 'Arrange playdates and teach sharing. This age learns cooperation and friendship.',
          emoji: '👫',
          category: 'Social'
        },
        {
          id: 3,
          title: 'Physical Activity',
          tip: 'Encourage running, jumping, and ball games. Develop gross motor skills through active play.',
          emoji: '⚽',
          category: 'Activity'
        }
      ];
    } else {
      return [
        {
          id: 1,
          title: 'School Readiness',
          tip: `At ${age}, practice writing letters and numbers. Read together to improve vocabulary and comprehension.`,
          emoji: '✏️',
          category: 'Development'
        },
        {
          id: 2,
          title: 'Independence',
          tip: 'Encourage self-care tasks like dressing, brushing teeth, and simple chores independently.',
          emoji: '🦷',
          category: 'Self-care'
        }
      ];
    }
  };

  const developmentMilestones = getAgeMilestones(selectedChild.age);
  const upcomingVaccines = getAgeVaccines(selectedChild.age);
  const careTips = getAgeTips(selectedChild.age);

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

  // Updated to open modal instead of showing alert
  const handleLogGrowth = (): void => {
    setShowGrowthModal(true);
  };

  const handleAddMedicine = (): void => {
    Alert.alert('Add Medicine', `Navigate to medicine management screen for ${selectedChild.name}`);
  };

  const handleBookCheckup = (): void => {
    Alert.alert('Book Checkup', `Navigate to appointment booking screen for ${selectedChild.name}`);
  };

  return (
    <>
      <ScrollView className="bg-gray-50 min-h-full max-w-md mx-auto">
        <HeaderSection childName={childData.name} />
        
        <View className="px-5 pb-8">
          <ChildInfoCard childData={childData} />
          <QuickActions 
            onLogGrowth={handleLogGrowth}
          />
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
        </View>
      </ScrollView>

      {/* Add Growth Modal */}
      <AddGrowthModal
        visible={showGrowthModal}
        onClose={() => setShowGrowthModal(false)}
      />
    </>
  );
};

export default HealthTrackerHome;