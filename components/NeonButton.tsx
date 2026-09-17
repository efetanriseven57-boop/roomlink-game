import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from "react-native";

type NeonColor = "green" | "cyan" | "magenta" | "red" | "orange";

const COLOR_MAP: Record<NeonColor, { border: string; text: string; bg: string }> = {
  green:   { border: "#00ff88", text: "#00ff88", bg: "rgba(0,255,136,0.12)" },
  cyan:    { border: "#00ffff", text: "#00ffff", bg: "rgba(0,255,255,0.10)" },
  magenta: { border: "#ff00ff", text: "#ff00ff", bg: "rgba(255,0,255,0.12)" },
  red:     { border: "#ff0044", text: "#ff0044", bg: "rgba(255,0,68,0.12)" },
  orange:  { border: "#ff6600", text: "#ff6600", bg: "rgba(255,102,0,0.12)" },
};

type Props = {
  label: string;
  onPress: () => void;
  color?: NeonColor;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  small?: boolean;
};

export function NeonButton({ label, onPress, color = "green", disabled, loading, style, small }: Props) {
  const c = COLOR_MAP[color];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.btn,
        { borderColor: c.border, backgroundColor: c.bg },
        small && styles.small,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={c.text} size="small" />
      ) : (
        <Text style={[styles.text, { color: c.text }, small && styles.smallText]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 52,
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  disabled: { opacity: 0.68 },
  text: {
    fontWeight: "bold",
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 1,
    textAlign: "center",
  },
  smallText: { fontSize: 13 },
});
