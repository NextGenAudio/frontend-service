/**
 * Theme Color Utilities
 * Centralized theme color mappings for consistent styling across components
 */

export interface ThemeColors {
  hover: string;
  hoverBg: string;
  border: string;
  text: string;
  gradient: string;
  shadow: string;
  solidBg: string; // Added solid background color
  activeBg?: string;
  hoverFrom?: string;
  hoverTo?: string;
  gradientText: string;
}

export interface ThemeColorVariants {
  // For general UI elements (folder page, etc.)
  general: ThemeColors;
  // For player controls with different opacity values
  controls: ThemeColors & {
    activeBg: string;
    hoverFrom: string;
    hoverTo: string;
    solidBg: string;
    gradientText: string;
  };
}

/**
 * Get theme-specific color variants for different component types
 */
export function getThemeColors(primaryColor: string): ThemeColorVariants {
  const colorMap = {
    "orange-500": {
      general: {
        hover: "hover:text-orange-400",
        hoverBg: "hover:bg-orange-400/10",
        border: "border-orange-400/50",
        text: "text-orange-400",
        gradient: "from-orange-600 to-pink-600",
        shadow: "shadow-orange-400/20",
        solidBg: "bg-orange-500",
        gradientText: "bg-gradient-to-r from-orange-300 via-orange-100 to-white"
      },
      controls: {
        hover: "hover:text-orange-400",
        hoverBg: "hover:bg-orange-400/30",
        border: "border-orange-300/20",
        text: "text-orange-400",
        gradient: "from-orange-600 to-pink-600",
        shadow: "hover:shadow-orange-400/50",
        activeBg: "bg-orange-400/30",
        hoverFrom: "hover:from-orange-500",
        hoverTo: "hover:to-orange-400",
        solidBg: "bg-orange-500",
        gradientText: "bg-gradient-to-r from-orange-300 via-orange-100 to-white"
      },
    },
    "purple-500": {
      general: {
        hover: "hover:text-purple-400",
        hoverBg: "hover:bg-purple-400/10",
        border: "border-purple-400/50",
        text: "text-purple-400",
        gradient: "from-purple-600 to-indigo-600",
        shadow: "shadow-purple-400/20",
        solidBg: "bg-purple-500",
        gradientText: "bg-gradient-to-r from-purple-300 via-purple-100 to-white"
      },
      controls: {
        hover: "hover:text-purple-400",
        hoverBg: "hover:bg-purple-400/30",
        border: "border-purple-300/20",
        text: "text-purple-400",
        gradient: "from-purple-600 to-indigo-600",
        shadow: "hover:shadow-purple-400/50",
        activeBg: "bg-purple-400/30",
        hoverFrom: "hover:from-purple-500",
        hoverTo: "hover:to-purple-400",
        solidBg: "bg-purple-500",
        gradientText: "bg-gradient-to-r from-purple-300 via-purple-100 to-white"
      },
    },
    "blue-500": {
      general: {
        hover: "hover:text-blue-400",
        hoverBg: "hover:bg-blue-400/10",
        border: "border-blue-400/50",
        text: "text-blue-400",
        gradient: "from-blue-600 to-cyan-600",
        shadow: "shadow-blue-400/20",
        solidBg: "bg-blue-500",
        gradientText: "bg-gradient-to-r from-blue-300 via-blue-100 to-white"
      },
      controls: {
        hover: "hover:text-blue-400",
        hoverBg: "hover:bg-blue-400/30",
        border: "border-blue-300/20",
        text: "text-blue-400",
        gradient: "from-blue-600 to-cyan-600",
        shadow: "hover:shadow-blue-400/50",
        activeBg: "bg-blue-400/30",
        hoverFrom: "hover:from-blue-500",
        hoverTo: "hover:to-blue-400",
        solidBg: "bg-blue-500",
        gradientText: "bg-gradient-to-r from-blue-300 via-blue-100 to-white"
      },
    },
    "green-500": {
      general: {
        hover: "hover:text-green-400",
        hoverBg: "hover:bg-green-400/10",
        border: "border-green-400/50",
        text: "text-green-400",
        gradient: "from-green-600 to-emerald-600",
        shadow: "shadow-green-400/20",
        solidBg: "bg-green-500",
        gradientText: "bg-gradient-to-r from-green-300 via-green-100 to-white"
      },
      controls: {
        hover: "hover:text-green-400",
        hoverBg: "hover:bg-green-400/30",
        border: "border-green-300/20",
        text: "text-green-400",
        gradient: "from-green-600 to-emerald-600",
        shadow: "hover:shadow-green-400/50",
        activeBg: "bg-green-400/30",
        hoverFrom: "hover:from-green-500",
        hoverTo: "hover:to-green-400",
        solidBg: "bg-green-500",
        gradientText: "bg-gradient-to-r from-green-300 via-green-100 to-white"
      },
    },
    "pink-500": {
      general: {
        hover: "hover:text-pink-400",
        hoverBg: "hover:bg-pink-400/10",
        border: "border-pink-400/50",
        text: "text-pink-400",
        gradient: "from-pink-600 to-rose-600",
        shadow: "shadow-pink-400/20",
        solidBg: "bg-pink-500",
        gradientText: "bg-gradient-to-r from-pink-300 via-pink-100 to-white"
      },
      controls: {
        hover: "hover:text-pink-400",
        hoverBg: "hover:bg-pink-400/30",
        border: "border-pink-300/20",
        text: "text-pink-400",
        gradient: "from-pink-600 to-rose-600",
        shadow: "hover:shadow-pink-400/50",
        activeBg: "bg-pink-400/30",
        hoverFrom: "hover:from-pink-500",
        hoverTo: "hover:to-pink-400",
        solidBg: "bg-pink-500",
        gradientText: "bg-gradient-to-r from-pink-300 via-pink-100 to-white"
      },
    },
    "teal-500": {
      general: {
        hover: "hover:text-teal-400",
        hoverBg: "hover:bg-teal-400/10",
        border: "border-teal-400/50",
        text: "text-teal-400",
        gradient: "from-teal-600 to-cyan-600",
        shadow: "shadow-teal-400/20",
        solidBg: "bg-teal-500",

        gradientText: "bg-gradient-to-r from-teal-300 via-teal-100 to-white"
      },
      controls: {
        hover: "hover:text-teal-400",
        hoverBg: "hover:bg-teal-400/30",
        border: "border-teal-300/20",
        text: "text-teal-400",
        gradient: "from-teal-600 to-cyan-600",
        shadow: "hover:shadow-teal-400/50",
        activeBg: "bg-teal-400/30",
        hoverFrom: "hover:from-teal-500",
        hoverTo: "hover:to-teal-400",
        solidBg: "bg-teal-500",
        gradientText: "bg-gradient-to-r from-teal-300 via-teal-100 to-white"
      },
    },
  };

  // Default to orange if color not found
  const defaultColors = colorMap["orange-500"];

  return colorMap[primaryColor as keyof typeof colorMap] || defaultColors;
}

/**
 * Convenience function to get general theme colors (for folder page, etc.)
 */
export function getGeneralThemeColors(primaryColor: string): ThemeColors {
  return getThemeColors(primaryColor).general;
}

/**
 * Convenience function to get control theme colors (for player controls)
 */
export function getControlThemeColors(primaryColor: string): ThemeColors & {
  activeBg: string;
  hoverFrom: string;
  hoverTo: string;
} {
  return getThemeColors(primaryColor).controls;
}

/**
 * Get theme-specific hex color values for canvas/direct color usage
 */
export function getThemeHexColors(primaryColor: string): {
  primary: string;
  secondary: string;
  accent: string;
} {
  const colorMap = {
    "orange-500": {
      primary: "#f97316", // orange-500
      secondary: "#fb923c", // orange-400
      accent: "#ec4899", // pink-500
    },
    "purple-500": {
      primary: "#a855f7", // purple-500
      secondary: "#c084fc", // purple-400
      accent: "#6366f1", // indigo-500
    },
    "blue-500": {
      primary: "#3b82f6", // blue-500
      secondary: "#60a5fa", // blue-400
      accent: "#06b6d4", // cyan-500
    },
    "green-500": {
      primary: "#22c55e", // green-500
      secondary: "#4ade80", // green-400
      accent: "#10b981", // emerald-500
    },
    "pink-500": {
      primary: "#ec4899", // pink-500
      secondary: "#f472b6", // pink-400
      accent: "#f43f5e", // rose-500
    },
    "teal-500": {
      primary: "#14b8a6", // teal-500
      secondary: "#2dd4bf", // teal-400
      accent: "#06b6d4", // cyan-500
    },
  };

  // Default to orange if color not found
  return (
    colorMap[primaryColor as keyof typeof colorMap] || colorMap["orange-500"]
  );
}
