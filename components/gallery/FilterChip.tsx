import {Ionicons} from '@expo/vector-icons';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Composant FilterChip
const FilterChip = ({
  filter,
  isSelected,
  onPress,
  palette,
  fonts,
  isRTL,
}: any) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {damping: 15, stiffness: 400});
    scale.value = withSpring(1, {damping: 15, stiffness: 300});
    onPress();
  };

  return (
    <AnimatedTouchable
      style={[
        styles.filterChip,
        animatedStyle,
        {
          backgroundColor: isSelected ? palette.tint : '#f0f0f0',
          borderColor: isSelected ? palette.tint : palette.tint + '20',
          flexDirection: isRTL ? 'row-reverse' : 'row',
        },
      ]}
      onPress={handlePress}>
      <Ionicons
        name={filter.icon as any}
        size={16}
        color={isSelected ? '#FFFFFF' : palette.tint}
      />
      <Text
        style={[
          styles.filterText,
          {
            color: isSelected ? '#FFFFFF' : palette.tint,
            fontFamily: fonts.body,
          },
        ]}>
        {filter.label}
      </Text>
    </AnimatedTouchable>
  );
};

export default FilterChip;

const styles = StyleSheet.create({
  filterChip: {
    // keep chip compact and prevent stretching inside a flex row
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginHorizontal: 6,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
  },
});
