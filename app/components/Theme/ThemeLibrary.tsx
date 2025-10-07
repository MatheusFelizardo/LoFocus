import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Image from "next/image";
import { Autocomplete, Chip, TextField } from "@mui/material";
import { ThemeConfig, useThemeStore } from "@/app/stores/useThemeStore";
import { solid } from "./themes/solid";
import { gradient } from "./themes/gradient";
import { usePomodoroStore } from "@/app/stores/usePomodoro";
import MiniScreen from "../MiniScreen";

export type ThemeType = "gradient" | "solid" | "environment" | "video";

export interface Theme {
  title: string;
  machineName: string;
  themeConfig: ThemeConfig;
  type: ThemeType;
  colors: string[];
  isAnimated: boolean;
}

export const themes: Theme[] = [...gradient, ...solid];

const ThemeLibrary = () => {
  const { saveProfile, configuration } = usePomodoroStore();
  const { isUpdatingTheme, updateTheme, themeConfig, setIsUpdatingTheme } =
    useThemeStore();
  const [filteredCards, setFilteredCards] = React.useState(themes);
  const typeOptions = Array.from(new Set(themes.map((theme) => theme.type)));

  return (
    <Box className="flex flex-col  pt-1 pr-2 h-[500px] w-[800px] max-w-full overflow-y-auto ">
      {/* Filter */}
      <Autocomplete
        freeSolo
        options={typeOptions}
        onInputChange={(event, newInputValue) => {
          const filtered = themes.filter((theme) =>
            theme.type.toLowerCase().includes(newInputValue.toLowerCase())
          );
          setFilteredCards(filtered);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            placeholder="Search..."
            className="mb-4"
          />
        )}
      />
      <Box className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
        {filteredCards.map((theme, index) => (
          <Card
            key={theme.title}
            data-active={themeConfig === theme.themeConfig ? "" : undefined}
            // className="rounded-none shadow-none border-2 border-white data-[active]:border-black/80  min-w-[150px] max-w-full"
            className={`rounded-none shadow-none border-none min-w-[150px] max-w-full ${
              themeConfig === theme.themeConfig ? "bg-gray-100" : ""
            }`}
          >
            <CardActionArea
              onClick={async () => {
                if (isUpdatingTheme) return;

                setIsUpdatingTheme(true);
                await saveProfile({
                  ...configuration,
                  selectedTheme: theme.machineName,
                });
                updateTheme(theme.machineName);
                setIsUpdatingTheme(false);
              }}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <Typography className="text-xs p-4 font-bold" component="div">
                  {theme.title}
                </Typography>

                <Box
                  className="aspect-[12/9]"
                  style={{
                    background: theme.themeConfig.background,
                    opacity: isUpdatingTheme ? 0.6 : 1,
                  }}
                >
                  <MiniScreen theme={theme} />
                </Box>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}

        {!filteredCards.length && (
          <Box className="col-span-full text-gray-500">
            No backgrounds found.
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ThemeLibrary;
