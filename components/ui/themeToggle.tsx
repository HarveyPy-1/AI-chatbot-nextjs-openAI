"use client";
import { MdOutlineLightMode, MdDarkMode } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";

const ThemeToggle = () => {
  // toggle light or dark mode
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <Label>
        {theme === "light" ? (
          <MdOutlineLightMode size={24} />
        ) : (
          <MdDarkMode size={24} />
        )}
      </Label>
      <Switch
        onClick={() => {
          theme === "dark" ? setTheme("light") : setTheme("dark");
        }}
      />
    </div>
  );
};
export default ThemeToggle;
