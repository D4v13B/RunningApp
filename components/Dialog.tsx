import React, { ReactNode, useEffect } from 'react';
import {
  Animated,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from 'react-native';
// import { X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';

interface DialogProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  closeOnBackdropPress?: boolean;
}

export function Dialog({
  visible,
  title,
  onClose,
  children,
  closeOnBackdropPress = true,
}: DialogProps) {
  const colorScheme = useColorScheme() || 'light';
  const opacity = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onClose();
    }
  };

  const handleClosePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.centeredView}>
          <Animated.View 
            style={[
              styles.backdrop,
              { opacity }
            ]} 
          />
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalView,
                {
                  backgroundColor: Colors.card[colorScheme],
                  borderColor: Colors.border[colorScheme],
                  opacity,
                  transform: [
                    {
                      scale: opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <View style={styles.header}>
                <Text
                  style={[
                    styles.title,
                    { color: Colors.text[colorScheme] },
                  ]}
                >
                  {title}
                </Text>
                <TouchableOpacity onPress={handleClosePress} style={styles.closeButton}>
                  {/* <X
                    size={20}
                    color={colorScheme === 'dark' ? Colors.text.dark : Colors.text.light}
                  /> */}
                  <MaterialIcons size={20} color={colorScheme === 'dark' ? Colors.text.dark : Colors.text.light}/>
                </TouchableOpacity>
              </View>
              <View style={styles.content}>{children}</View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 0,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
});