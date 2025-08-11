import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar 
} from 'react-native';

const HealthTracker = () => {
  const [activeTab, setActiveTab] = useState('Growth');

  const childData = {
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

  const upcomingVaccines = [
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

  const medicalRecords = [
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

  const renderGrowthTab = () => (
    <View style={{ marginTop: 16 }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📈</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Growth Progress</Text>
        </View>
        
        <View style={{
          backgroundColor: '#f8fafc',
          borderRadius: 12,
          padding: 32,
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 180,
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: '#e2e8f0'
        }}>
          <Text style={{ fontSize: 40, marginBottom: 12 }}>📊</Text>
          <Text style={{ 
            color: '#64748b', 
            textAlign: 'center',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 4
          }}>
            Interactive growth chart coming soon!
          </Text>
          <Text style={{ 
            color: '#94a3b8', 
            textAlign: 'center',
            fontSize: 14
          }}>
            Track height and weight over time
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 20,
          backgroundColor: '#f1f5f9',
          borderRadius: 12,
          padding: 16
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>This Month</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#059669' }}>+2 cm</Text>
            <Text style={{ color: '#6b7280', fontSize: 11 }}>Height</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 4 }}>This Month</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#059669' }}>+0.4 kg</Text>
            <Text style={{ color: '#6b7280', fontSize: 11 }}>Weight</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderVaccinesTab = () => (
    <View style={{ marginTop: 16 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>💉</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Vaccination Schedule</Text>
        </View>
        <TouchableOpacity style={{
          backgroundColor: '#3b82f6',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8
        }}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Print Record</Text>
        </TouchableOpacity>
      </View>
      
      {upcomingVaccines.map((vaccine) => (
        <View key={vaccine.id} style={{
          backgroundColor: vaccine.urgent ? '#fef2f2' : '#eff6ff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          borderWidth: 2,
          borderColor: vaccine.urgent ? '#fecaca' : '#bfdbfe',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12
          }}>
            <View style={{
              backgroundColor: vaccine.urgent ? '#ef4444' : '#3b82f6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{ marginRight: 4, fontSize: 12 }}>
                {vaccine.urgent ? '⚠️' : '📅'}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '600'
              }}>
                {vaccine.dueDate}
              </Text>
            </View>
            <TouchableOpacity style={{
              backgroundColor: '#3b82f6',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Text style={{ marginRight: 4 }}>🔔</Text>
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Remind Me</Text>
            </TouchableOpacity>
          </View>
          <Text style={{
            fontWeight: '700',
            color: '#1f2937',
            fontSize: 16,
            marginBottom: 4
          }}>{vaccine.name}</Text>
          <Text style={{
            color: '#6b7280',
            fontSize: 14
          }}>{vaccine.description}</Text>
        </View>
      ))}
    </View>
  );

  const renderRecordsTab = () => (
    <View style={{ marginTop: 16 }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 20, marginRight: 8 }}>📋</Text>
          <Text style={{
            fontSize: 18,
            fontWeight: '700',
            color: '#1f2937'
          }}>Medical History</Text>
        </View>
        <TouchableOpacity style={{
          backgroundColor: '#10b981',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center'
        }}>
          <Text style={{ marginRight: 4, color: 'white' }}>⬇️</Text>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 12 }}>Export</Text>
        </TouchableOpacity>
      </View>
      
      {medicalRecords.map((record) => (
        <View key={record.id} style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          borderLeftWidth: 4,
          borderLeftColor: record.status === 'completed' ? '#10b981' : '#f59e0b'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <View style={{
              width: 40,
              height: 40,
              backgroundColor: record.status === 'completed' ? '#d1fae5' : '#fef3c7',
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12
            }}>
              <Text style={{ fontSize: 18 }}>{record.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{
                fontWeight: '700',
                color: '#1f2937',
                fontSize: 16,
                marginBottom: 4
              }}>{record.type}</Text>
              <Text style={{
                color: '#6b7280',
                fontSize: 13,
                marginBottom: 8,
                fontWeight: '500'
              }}>📅 {record.date} • 👨‍⚕️ {record.doctor}</Text>
              <Text style={{
                color: '#4b5563',
                fontSize: 14,
                lineHeight: 20
              }}>{record.notes}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      

      {/* Header */}
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

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ padding: 16 }}>
          {/* Child Dashboard Card */}
          <View style={{
            backgroundColor: '#6366f1',
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
            marginBottom: 16
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 16
            }}>
              <Text style={{ fontSize: 28, marginRight: 12 }}>👶</Text>
              <View>
                <Text style={{
                  fontSize: 22,
                  fontWeight: '800',
                  color: 'white'
                }}>
                  {childData.name} ({childData.age})
                </Text>
                <Text style={{
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  Last check-up: {childData.lastCheckup}
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: 12, 
                  marginBottom: 6,
                  fontWeight: '500'
                }}>Height</Text>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '800', 
                  color: 'white',
                  marginBottom: 4
                }}>{childData.height} cm</Text>
                <View style={{
                  backgroundColor: '#10b981',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 11, 
                    fontWeight: '700'
                  }}>{childData.heightChange}</Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: 12, 
                  marginBottom: 6,
                  fontWeight: '500'
                }}>Weight</Text>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '800', 
                  color: 'white',
                  marginBottom: 4
                }}>{childData.weight} kg</Text>
                <View style={{
                  backgroundColor: '#10b981',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 11, 
                    fontWeight: '700'
                  }}>{childData.weightChange}</Text>
                </View>
              </View>
              
              <View style={{ alignItems: 'center', flex: 1 }}>
                <Text style={{ 
                  color: 'rgba(255,255,255,0.7)', 
                  fontSize: 12, 
                  marginBottom: 6,
                  fontWeight: '500'
                }}>BMI</Text>
                <Text style={{ 
                  fontSize: 20, 
                  fontWeight: '800', 
                  color: 'white',
                  marginBottom: 4
                }}>{childData.bmi}</Text>
                <View style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 10
                }}>
                  <Text style={{ 
                    color: 'white', 
                    fontSize: 11, 
                    fontWeight: '700'
                  }}>{childData.bmiStatus}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Tabs */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            marginBottom: 4,
            overflow: 'hidden'
          }}>
            <View style={{ flexDirection: 'row' }}>
              {[
                { name: 'Growth', emoji: '📈' },
                { name: 'Vaccines', emoji: '💉' },
                { name: 'Records', emoji: '📋' }
              ].map((tab, index) => (
                <TouchableOpacity
                  key={tab.name}
                  onPress={() => setActiveTab(tab.name)}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 8,
                    backgroundColor: activeTab === tab.name ? '#3b82f6' : 'transparent',
                    marginHorizontal: activeTab === tab.name ? 4 : 0,
                    marginVertical: activeTab === tab.name ? 4 : 0,
                    borderRadius: activeTab === tab.name ? 12 : 0,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{
                    fontSize: 16,
                    marginBottom: 2
                  }}>
                    {tab.emoji}
                  </Text>
                  <Text style={{
                    fontWeight: '600',
                    fontSize: 13,
                    color: activeTab === tab.name ? 'white' : '#64748b'
                  }}>
                    {tab.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Tab Content */}
          {activeTab === 'Growth' && renderGrowthTab()}
          {activeTab === 'Vaccines' && renderVaccinesTab()}
          {activeTab === 'Records' && renderRecordsTab()}
        </View>
      </ScrollView>

      
    </SafeAreaView>
  );
};

export default HealthTracker;