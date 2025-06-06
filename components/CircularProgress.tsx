import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, useColorScheme, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  showText?: boolean;
  textSize?: number;
}

export function CircularProgress({
  size,
  strokeWidth,
  progress,
  showText = true,
  textSize = 18,
}: CircularProgressProps) {
  const colorScheme = useColorScheme() || 'light';
  
  // Constrain progress between 0 and 1
  const progressValue = Math.min(Math.max(progress, 0), 1);
  
  // Calculate radius and center position
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  
  // Calculate circle properties
  const circumference = radius * 2 * Math.PI;
  const progressArc = circumference * (1 - progressValue);
  
  // Format percentage text
  const percentage = Math.round(progressValue * 100);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Background Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={Colors.progress.background[colorScheme]}
            fill="none"
          />
          
          {/* Progress Circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={strokeWidth}
            stroke={Colors.progress[colorScheme]}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progressArc}
          />
        </G>
      </Svg>
      
      {showText && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.progressText,
              { fontSize: textSize, color: Colors.text[colorScheme] }
            ]}
          >
            {`${percentage}%`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontWeight: '600',
  },
});