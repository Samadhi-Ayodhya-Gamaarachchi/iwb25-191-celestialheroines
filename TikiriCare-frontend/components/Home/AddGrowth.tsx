import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView, 
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useChild } from '../../context/ChildContext';

const { height: screenHeight } = Dimensions.get('window');

interface AddGrowthModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddGrowthModal: React.FC<AddGrowthModalProps> = ({ visible, onClose }) => {
  const { selectedChild, updateChild } = useChild();
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState<number>(0);
  const [isValid, setIsValid] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      // Pre-fill with existing data if available
      if (selectedChild?.height) {
        setHeight(selectedChild.height.toString());
      } else {
        setHeight('');
      }
      if (selectedChild?.weight) {
        setWeight(selectedChild.weight.toString());
      } else {
        setWeight('');
      }
    }
  }, [visible, selectedChild]);

  // Calculate BMI automatically when height or weight changes
  useEffect(() => {
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (heightNum > 0 && weightNum > 0) {
      // BMI = weight (kg) / (height (m))^2
      const heightInMeters = heightNum / 100;
      const calculatedBmi = weightNum / (heightInMeters * heightInMeters);
      setBmi(Math.round(calculatedBmi * 10) / 10);
      setIsValid(true);
    } else {
      setBmi(0);
      setIsValid(false);
    }
  }, [height, weight]);

  const getBMIStatus = (bmi: number) => {
    if (bmi < 16) return { status: 'Underweight', color: '#fbbf24' };
    if (bmi < 25) return { status: 'Normal', color: '#10b981' };
    if (bmi < 30) return { status: 'Overweight', color: '#f59e0b' };
    return { status: 'Obese', color: '#ef4444' };
  };

  const calculateGrowthChanges = (newHeight: number, newWeight: number) => {
    const oldHeight = selectedChild?.height || 0;
    const oldWeight = selectedChild?.weight || 0;
    
    const heightChange = oldHeight > 0 ? newHeight - oldHeight : 0;
    const weightChange = oldWeight > 0 ? newWeight - oldWeight : 0;
    
    return {
      heightChange: heightChange > 0 ? `+${heightChange.toFixed(1)} cm` : `${heightChange.toFixed(1)} cm`,
      weightChange: weightChange > 0 ? `+${weightChange.toFixed(1)} kg` : `${weightChange.toFixed(1)} kg`
    };
  };

  const handleSave = () => {
    if (!isValid || !selectedChild) {
      Alert.alert('Invalid Input', 'Please enter valid height and weight values.');
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const { heightChange, weightChange } = calculateGrowthChanges(heightNum, weightNum);

    // Update the child's data in context
    const updates = {
      height: heightNum,
      weight: weightNum,
      bmi: parseFloat(bmi.toFixed(1)),
      lastCheckup: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      heightChange,
      weightChange,
      bmiStatus: getBMIStatus(bmi).status
    };

    updateChild(selectedChild.id, updates);

    Alert.alert(
      'Growth Data Saved! 🎉', 
      `${selectedChild.name}'s growth data has been updated successfully.\n\n📏 Height: ${height} cm\n⚖️ Weight: ${weight} kg\n📈 BMI: ${bmi.toFixed(1)} (${getBMIStatus(bmi).status})`,
      [{ text: 'Great!', onPress: onClose }]
    );
  };

  const handleClose = () => {
    // Reset form when closing
    setHeight('');
    setWeight('');
    setBmi(0);
    setIsValid(false);
    onClose();
  };

  const bmiStatus = getBMIStatus(bmi);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: screenHeight * 0.9,
            minHeight: screenHeight * 0.6,
          }}
        >
          {/* Header with Close Button */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e5e7eb'
          }}>
            <View>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: '800', 
                color: '#1f2937' 
              }}>
                Add Growth Data
              </Text>
              <Text style={{ 
                color: '#6b7280', 
                fontSize: 16,
                fontWeight: '500',
                marginTop: 2
              }}>
                {selectedChild?.name || "Child"}'s measurements
              </Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleClose}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 20,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ fontSize: 20, color: '#6b7280' }}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ padding: 24 }}>
              {/* Height Input */}
              <View style={{ 
                backgroundColor: '#f9fafb',
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: height ? '#3b82f6' : '#e5e7eb',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>📏</Text>
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '700', 
                    color: '#1f2937' 
                  }}>
                    Height
                  </Text>
                </View>
                <TextInput
                  value={height}
                  onChangeText={setHeight}
                  placeholder="Enter height in cm"
                  keyboardType="numeric"
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                  }}
                />
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 14, 
                  marginTop: 8,
                  fontWeight: '500'
                }}>
                  Measured in centimeters
                </Text>
              </View>

              {/* Weight Input */}
              <View style={{ 
                backgroundColor: '#f9fafb',
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                borderWidth: 2,
                borderColor: weight ? '#3b82f6' : '#e5e7eb',
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 24, marginRight: 12 }}>⚖️</Text>
                  <Text style={{ 
                    fontSize: 18, 
                    fontWeight: '700', 
                    color: '#1f2937' 
                  }}>
                    Weight
                  </Text>
                </View>
                <TextInput
                  value={weight}
                  onChangeText={setWeight}
                  placeholder="Enter weight in kg"
                  keyboardType="numeric"
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#374151',
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: '#d1d5db',
                  }}
                />
                <Text style={{ 
                  color: '#6b7280', 
                  fontSize: 14, 
                  marginTop: 8,
                  fontWeight: '500'
                }}>
                  Measured in kilograms
                </Text>
              </View>

              {/* BMI Display - Auto-calculated */}
              {bmi > 0 && (
                <View style={{ 
                  backgroundColor: '#f0f9ff',
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 24,
                  borderWidth: 2,
                  borderColor: '#3b82f6',
                  alignItems: 'center'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 24, marginRight: 12 }}>📈</Text>
                    <Text style={{ 
                      fontSize: 18, 
                      fontWeight: '700', 
                      color: '#1f2937' 
                    }}>
                      BMI (Auto-calculated)
                    </Text>
                  </View>
                  
                  <Text style={{ 
                    fontSize: 48, 
                    fontWeight: '800', 
                    color: '#1f2937',
                    marginBottom: 12
                  }}>
                    {bmi.toFixed(1)}
                  </Text>
                  
                  <View style={{
                    backgroundColor: bmiStatus.color,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    borderRadius: 25
                  }}>
                    <Text style={{ 
                      color: 'white', 
                      fontSize: 16, 
                      fontWeight: '700'
                    }}>
                      {bmiStatus.status}
                    </Text>
                  </View>
                </View>
              )}

              {/* Action Buttons */}
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
                gap: 12,
                marginTop: 20,
                marginBottom: 20
              }}>
                <TouchableOpacity
                  onPress={handleClose}
                  style={{
                    flex: 1,
                    backgroundColor: '#f3f4f6',
                    borderRadius: 16,
                    padding: 16,
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: '#e5e7eb'
                  }}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: '#6b7280' 
                  }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={!isValid}
                  style={{
                    flex: 2,
                    backgroundColor: isValid ? '#3b82f6' : '#d1d5db',
                    borderRadius: 16,
                    padding: 16,
                    alignItems: 'center',
                    shadowColor: isValid ? '#3b82f6' : 'transparent',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: isValid ? 6 : 0,
                  }}
                >
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '700', 
                    color: 'white' 
                  }}>
                    💾 Save Growth Data
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

export default AddGrowthModal;