import React, {PropsWithChildren, useRef} from 'react';
import {PanResponder, Animated} from 'react-native';

interface PanGestureProps extends PropsWithChildren {
  thresholdDx: number;
  onSwipeLeft: () => void;
  pan: Animated.ValueXY;
  shouldUsePositionFromPan: boolean;
}

export const PanGestureRecognizer = (props: PanGestureProps) => {
  const {thresholdDx, onSwipeLeft, children, pan, shouldUsePositionFromPan} =
    props;
  const triggerSwipeLeftAnimation = (positionX: Animated.Value) => {
    const duration = 100;
    Animated.timing(positionX, {
      toValue: -400,
      duration: duration,
      useNativeDriver: true,
    }).start();
    return new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, duration);
    });
  };

  const springBack = () => {
    // @ts-ignore
    if (pan.x._value > thresholdDx) {
      Animated.spring(pan, {
        toValue: {x: 0, y: 0},
        useNativeDriver: true,
      }).start();
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        const {dx, dy} = gestureState;
        const magnitudeDx = Math.abs(dx);
        const magnitudeDy = Math.abs(dy);
        return magnitudeDx - magnitudeDy > 5 && dx < 0;
      },
      onPanResponderMove: async (_, gesture) => {
        const nextPositionX = gesture.dx;
        pan.setValue({x: nextPositionX, y: 0});
        if (nextPositionX <= thresholdDx) {
          await triggerSwipeLeftAnimation(pan.x);
          onSwipeLeft();
        }
      },
      onPanResponderRelease: () => {
        springBack();
      },
      onPanResponderTerminate: () => {
        springBack();
      },
    }),
  ).current;
  return (
    <Animated.View
      style={{
        transform: [{translateX: shouldUsePositionFromPan ? pan.x : 0}],
      }}
      {...panResponder.panHandlers}>
      {children}
    </Animated.View>
  );
};
