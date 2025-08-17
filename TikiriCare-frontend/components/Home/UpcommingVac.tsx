import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Vaccine } from './HomeType';

interface UpcomingVaccinesProps {
  vaccines: Vaccine[];
}

const UpcomingVaccines: React.FC<UpcomingVaccinesProps> = ({ vaccines }) => {
  return (
    <View className="bg-white rounded-2xl p-6 mt-5 shadow-md">
      <View className="flex-row justify-between items-center mb-6">
        <View className="flex-row items-center">
          <Text className="text-3xl mr-3">💉</Text>
          <Text className="text-gray-900 text-xl font-extrabold">Upcoming Vaccines</Text>
        </View>
        <TouchableOpacity>
          <Text className="text-blue-600 text-sm font-semibold">View All</Text>
        </TouchableOpacity>
      </View>

      {vaccines.map((vaccine) => (
        <View
          key={vaccine.id}
          className={`rounded-xl p-5 mb-3 border-l-4 shadow-md ${
            vaccine.urgent
              ? 'bg-red-50 border-red-600 shadow-red-300'
              : 'bg-blue-50 border-blue-600 shadow-blue-300'
          }`}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1">
              <Text className="text-2xl mr-4">{vaccine.emoji}</Text>
              <View>
                <Text className="text-gray-900 font-bold text-lg mb-1">{vaccine.name}</Text>
                <Text
                  className={`text-sm font-semibold ${
                    vaccine.urgent ? 'text-red-600' : 'text-blue-700'
                  }`}
                >
                  {vaccine.dueDate}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              className={`px-4 py-2 rounded-xl shadow-md ${
                vaccine.urgent ? 'bg-red-600 shadow-red-600' : 'bg-blue-600 shadow-blue-600'
              }`}
            >
              <Text className="text-white text-xs font-bold">🔔 Remind</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
};

export default UpcomingVaccines;