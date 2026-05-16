import { useTheme } from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { darkMode, toggle } = useTheme();
  return (
    <button onClick={toggle}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-100"} ${className}`}
      title={darkMode ? "Modo claro" : "Modo oscuro"}>
      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${darkMode ? "bg-teal-500" : "bg-gray-300"}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? "left-5 bg-gray-900" : "left-0.5 bg-white"}`}>
          {darkMode ? "🌙" : "☀️"}
        </span>
      </div>
      <span className="text-sm font-medium hidden sm:block">{darkMode ? "Oscuro" : "Claro"}</span>
    </button>
  );
}