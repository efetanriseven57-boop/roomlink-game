import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

type StarProps = { x: number; y: number; size: number; delay: number };

function Star({ x, y, size, delay }: StarProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 1500, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 1500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        { left: x, top: y, width: size, height: size, opacity },
      ]}
    />
  );
}

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 2.5 + 0.5,
  delay: Math.random() * 3000,
}));

export function StarsBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map((s) => (
        <Star key={s.id} x={s.x} y={s.y} size={s.size} delay={s.delay} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  star: {
    position: "absolute",
    backgroundColor: "#ffffff",
    borderRadius: 99,
  },
});
