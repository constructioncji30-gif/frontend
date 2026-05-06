/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🔹 Layout
        header: "#1E3A8A",       // Deep Navy Blue
        sidebar: "#111827",      // Charcoal Black
        sidebarText: "#D1D5DB",  // Light Gray
        pageBg: "#F9FAFB",       // Light Grayish White
        surface: "#FFFFFF",      // White
        border: "#9da2ab",       // Neutral Gray
cardBorder:'rgb(147 51 234 / var(--tw-bg-opacity, 1))',
        // 🔹 Buttons
        primary: "#2563EB",      // Primary Blue
        primaryHover: "#1D4ED8", // Dark Blue

        secondary: "#F3F4F6",      // Light Gray
        secondaryText: "#111827",  // Charcoal Black
        secondaryHover: "#E5E7EB", // Medium Gray

        success: "#10B981",      // Emerald Green
        successHover: "#059669", // Dark Green

        danger: "#EF4444",      // Bright Red
        dangerHover: "#DC2626", // Dark Red

        warning: "#F59E0B",      // Amber
        warningHover: "#D97706", // Dark Amber

        view: "#3B82F6",         // Sky Blue
        viewHover: "#2563EB",    // Primary Blue

        // 🔹 Forms
        inputBg: "#FFFFFF",       // White
        inputBorder: "#D1D5DB",   // Gray 300
        inputFocus: "#2563EB",    // Primary Blue
        inputText: "#111827",     // Charcoal Black
        labelText: "#374151",     // Gray 700
        placeholder: "#9CA3AF",   // Gray 400
        disabled: "#F3F4F6",      // Gray 100

        // 🔹 Modals / Popups
        modalHeader: "#2563EB",   // Primary Blue
        modalHeaderText: "#FFFFFF", // White
        modalBody: "#FFFFFF",     // White
        modalBorder: "#E5E7EB",   // Neutral Gray
        modalClose: "#9CA3AF",    // Gray 400
        modalCloseHover: "#EF4444", // Red

        // 🔹 Status
        statusSuccess: "#10B981", // Emerald Green
        statusError: "#EF4444",   // Red
        statusWarning: "#F59E0B", // Amber
        statusInfo: "#3B82F6",    // Sky Blue

        // 🔹 Tables
        tableHeader: "#F3F4F6",   // Gray 100
        tableHeaderText: "#374151", // Gray 700
        tableRowHover: "#E5E7EB", // Gray 200
        tableDivider: "#E5E7EB",  // Gray 200
      },
    },
  },
  plugins: [],
};
