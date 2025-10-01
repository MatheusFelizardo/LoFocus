import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Image from "next/image";
import { Autocomplete, TextField } from "@mui/material";
import { useThemeStore } from "@/app/stores/useThemeStore";

enum ThemeType {
  GRADIENT = "gradient",
  SOLID = "solid",
  ENVIRONMENT = "environment",
  VIDEO = "video",
}
export interface ThemeCard {
  title: string;
  background: string;
  type: ThemeType;
  colors: string[];
  isAnimated: boolean;
}

const solidBackgrounds: ThemeCard[] = [
  {
    title: "Slate",
    background: "#64748b",
    type: ThemeType.SOLID,
    colors: ["slate"],
    isAnimated: false,
  },
  {
    title: "Gray",
    background: "#6b7280",
    type: ThemeType.SOLID,
    colors: ["gray"],
    isAnimated: false,
  },
  {
    title: "Zinc",
    background: "#71717a",
    type: ThemeType.SOLID,
    colors: ["zinc"],
    isAnimated: false,
  },
  {
    title: "Neutral",
    background: "#737373",
    type: ThemeType.SOLID,
    colors: ["neutral"],
    isAnimated: false,
  },
  {
    title: "Stone",
    background: "#78716c",
    type: ThemeType.SOLID,
    colors: ["stone"],
    isAnimated: false,
  },
  {
    title: "Red",
    background: "#ef4444",
    type: ThemeType.SOLID,
    colors: ["red"],
    isAnimated: false,
  },
  {
    title: "Orange",
    background: "#f97316",
    type: ThemeType.SOLID,
    colors: ["orange"],
    isAnimated: false,
  },
  {
    title: "Amber",
    background: "#f59e0b",
    type: ThemeType.SOLID,
    colors: ["amber"],
    isAnimated: false,
  },
  {
    title: "Yellow",
    background: "#eab308",
    type: ThemeType.SOLID,
    colors: ["yellow"],
    isAnimated: false,
  },
  {
    title: "Lime",
    background: "#84cc16",
    type: ThemeType.SOLID,
    colors: ["lime"],
    isAnimated: false,
  },
  {
    title: "Green",
    background: "#22c55e",
    type: ThemeType.SOLID,
    colors: ["green"],
    isAnimated: false,
  },
  {
    title: "Emerald",
    background: "#10b981",
    type: ThemeType.SOLID,
    colors: ["emerald"],
    isAnimated: false,
  },
  {
    title: "Teal",
    background: "#14b8a6",
    type: ThemeType.SOLID,
    colors: ["teal"],
    isAnimated: false,
  },
  {
    title: "Cyan",
    background: "#06b6d4",
    type: ThemeType.SOLID,
    colors: ["cyan"],
    isAnimated: false,
  },
  {
    title: "Sky",
    background: "#0ea5e9",
    type: ThemeType.SOLID,
    colors: ["sky"],
    isAnimated: false,
  },
  {
    title: "Blue",
    background: "#3b82f6",
    type: ThemeType.SOLID,
    colors: ["blue"],
    isAnimated: false,
  },
  {
    title: "Indigo",
    background: "#6366f1",
    type: ThemeType.SOLID,
    colors: ["indigo"],
    isAnimated: false,
  },
  {
    title: "Violet",
    background: "#8b5cf6",
    type: ThemeType.SOLID,
    colors: ["violet"],
    isAnimated: false,
  },
  {
    title: "Purple",
    background: "#a855f7",
    type: ThemeType.SOLID,
    colors: ["purple"],
    isAnimated: false,
  },
  {
    title: "Fuchsia",
    background: "#d946ef",
    type: ThemeType.SOLID,
    colors: ["fuchsia"],
    isAnimated: false,
  },
  {
    title: "Pink",
    background: "#ec4899",
    type: ThemeType.SOLID,
    colors: ["pink"],
    isAnimated: false,
  },
  {
    title: "Rose",
    background: "#f43f5e",
    type: ThemeType.SOLID,
    colors: ["rose"],
    isAnimated: false,
  },
];

const gradientBackgrounds: ThemeCard[] = [
  {
    title: "Sunset",
    background: "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 100%)",
    type: ThemeType.GRADIENT,
    colors: ["pink", "lightpink"],
    isAnimated: false,
  },
  {
    title: "Sunrise",
    background:
      "linear-gradient(45deg, rgb(250, 218, 97) 0%, rgb(255, 145, 136) 50%, rgb(255, 90, 205) 100%)",
    type: ThemeType.GRADIENT,
    colors: ["yellow", "pink"],
    isAnimated: false,
  },
  {
    title: "Nature",
    background:
      "linear-gradient(45deg, rgb(97, 250, 218) 0%, rgb(136, 255, 145) 50%, rgb(205, 255, 90) 100%)",
    type: ThemeType.GRADIENT,
    colors: ["cyan", "lime", "lightgreen"],
    isAnimated: false,
  },
  {
    title: "Ocean",
    background:
      "linear-gradient(45deg, rgb(97, 218, 250) 0%, rgb(136, 145, 255) 50%, rgb(90, 205, 255) 100%)",
    type: ThemeType.GRADIENT,
    colors: ["lightblue", "blue", "darkblue"],
    isAnimated: false,
  },
  {
    title: "Galaxy",
    background:
      "linear-gradient(45deg, rgb(218, 97, 250) 0%, rgb(145, 136, 255) 50%, rgb(205, 90, 255) 100%)",
    type: ThemeType.GRADIENT,
    colors: ["purple", "blue", "pink"],
    isAnimated: false,
  },
  {
    title: "Aurora",
    background: "linear-gradient(45deg, #00c6ff 0%, #0072ff 100%)",
    type: ThemeType.GRADIENT,
    colors: ["cyan", "blue"],
    isAnimated: false,
  },
  {
    title: "Peach",
    background: "linear-gradient(45deg, #ffecd2 0%, #fcb69f 100%)",
    type: ThemeType.GRADIENT,
    colors: ["peach", "orange"],
    isAnimated: false,
  },
  {
    title: "Forest",
    background: "linear-gradient(45deg, #11998e 0%, #38ef7d 100%)",
    type: ThemeType.GRADIENT,
    colors: ["teal", "green"],
    isAnimated: false,
  },
  {
    title: "Berry",
    background: "linear-gradient(45deg, #ff6a88 0%, #ff99ac 100%)",
    type: ThemeType.GRADIENT,
    colors: ["red", "pink"],
    isAnimated: false,
  },
  {
    title: "Midnight",
    background: "linear-gradient(45deg, #141e30 0%, #243b55 100%)",
    type: ThemeType.GRADIENT,
    colors: ["darkblue", "navy"],
    isAnimated: false,
  },
  {
    title: "Candy",
    background: "linear-gradient(45deg, #f6d365 0%, #fda085 100%)",
    type: ThemeType.GRADIENT,
    colors: ["yellow", "orange", "pink"],
    isAnimated: false,
  },
  {
    title: "Mint",
    background: "linear-gradient(45deg, #a1ffce 0%, #faffd1 100%)",
    type: ThemeType.GRADIENT,
    colors: ["mint", "lightgreen", "white"],
    isAnimated: false,
  },
];

const environmentBackgrounds: ThemeCard[] = [];
const videoBackgrounds: ThemeCard[] = [];

const cards: ThemeCard[] = [
  ...gradientBackgrounds,
  ...solidBackgrounds,
  ...environmentBackgrounds,
  ...videoBackgrounds,
];

const ThemeLibrary = () => {
  const { setCurrentBackground, currentBackground } = useThemeStore();
  const [filteredCards, setFilteredCards] = React.useState(cards);
  const typeOptions = Object.values(ThemeType).map(
    (type) =>
      type.toString().charAt(0).toUpperCase() +
      type.toString().slice(1).toLowerCase()
  );

  return (
    <Box className="flex flex-col  pt-1 pr-2 h-[500px] w-[800px] max-w-full overflow-y-auto ">
      {/* Filter */}
      <Autocomplete
        freeSolo
        options={typeOptions}
        onInputChange={(event, newInputValue) => {
          const filtered = cards.filter((card) =>
            card.type.toLowerCase().includes(newInputValue.toLowerCase())
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
        {filteredCards.map((card, index) => (
          <Card
            key={card.title}
            data-active={currentBackground === card.background ? "" : undefined}
            className="rounded-none shadow-none border-2 border-white data-[active]:border-black/80  min-w-[150px] max-w-full"
          >
            <CardActionArea
              onClick={() => {
                setCurrentBackground(card.background);
              }}
              className="overflow-hidden"
            >
              <CardContent className="p-0">
                <Typography className="text-xs p-4 font-bold" component="div">
                  {card.title}
                </Typography>

                <Box
                  className="aspect-[12/9]"
                  style={{ background: card.background }}
                ></Box>
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
