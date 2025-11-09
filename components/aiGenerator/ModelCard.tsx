import {Colors} from '@/constants/theme';
import {Ionicons} from '@expo/vector-icons';
import {LinearGradient} from 'expo-linear-gradient';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// Composant ModelCard
const ModelCard = ({
  model,
  isSelected,
  onPress,
  palette,
  fonts,
  userMembership,
}: any) => {
  const scale = useSharedValue(1);
  const themeData = Colors[model.theme as keyof typeof Colors] as any;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.95, {damping: 15, stiffness: 400});
    scale.value = withSpring(1, {damping: 15, stiffness: 300});
    onPress();
  };

  const isLocked = userMembership !== 'premium' && model.premium;

  return (
    <AnimatedTouchable
      style={[
        styles.modelCard,
        animatedStyle,
        {
          borderColor: isSelected ? palette.tint : 'transparent',
          borderWidth: isSelected ? 2 : 0,
        },
      ]}
      onPress={handlePress}>
      <LinearGradient
        colors={
          themeData?.gradient || [palette.tint + '40', palette.tint + '20']
        }
        style={styles.modelGradient}>
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Ionicons name="lock-closed" size={20} color="#FFFFFF" />
          </View>
        )}

        <Ionicons
          name={model.icon as any}
          size={24}
          color={themeData?.text || '#FFFFFF'}
        />
        <Text
          style={[
            styles.modelName,
            {
              color: themeData?.text || '#FFFFFF',
              fontFamily: fonts.accent,
            },
          ]}>
          {model.name}
        </Text>
        <Text
          style={[
            styles.modelDescription,
            {
              color: (themeData?.text || '#FFFFFF') + '80',
              fontFamily: fonts.body,
            },
          ]}>
          {model.description}
        </Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  modelCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  modelGradient: {
    padding: 20,
    position: 'relative',
  },
  lockOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modelName: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 12,
  },
});

export default ModelCard;
