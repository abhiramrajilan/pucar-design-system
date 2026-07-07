// Raw Radix Colors ramps — Tier 1 primitives (step 1 … 12).
// Sourced verbatim from @radix-ui/colors. This is the ONLY place literal color values live.
// Foundations rev 3 anchors: Neutral=Sand(warm) / Slate(cool) / Gray(true) · Brand=Teal
// Success=Green · Info=Blue · Warning=Amber · Destructive=Red.

export type Ramp = readonly [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
]

export interface RampPair {
  light: Ramp
  dark: Ramp
}

export const ramps = {
  // ---- Neutrals (pick one for --neutral-* via NEUTRAL in tokens.ts) ----
  sand: {
    light: ["#fdfdfc", "#f9f9f8", "#f1f0ef", "#e9e8e6", "#e2e1de", "#dad9d6", "#cfceca", "#bcbbb5", "#8d8d86", "#82827c", "#63635e", "#21201c"],
    dark: ["#111110", "#191918", "#222221", "#2a2a28", "#31312e", "#3b3a37", "#494844", "#62605b", "#6f6d66", "#7c7b74", "#b5b3ad", "#eeeeec"],
  },
  slate: {
    light: ["#fcfcfd", "#f9f9fb", "#f0f0f3", "#e8e8ec", "#e0e1e6", "#d9d9e0", "#cdced6", "#b9bbc6", "#8b8d98", "#80838d", "#60646c", "#1c2024"],
    dark: ["#111113", "#18191b", "#212225", "#272a2d", "#2e3135", "#363a3f", "#43484e", "#5a6169", "#696e77", "#777b84", "#b0b4ba", "#edeef0"],
  },
  gray: {
    light: ["#fcfcfc", "#f9f9f9", "#f0f0f0", "#e8e8e8", "#e0e0e0", "#d9d9d9", "#cecece", "#bbbbbb", "#8d8d8d", "#838383", "#646464", "#202020"],
    dark: ["#111111", "#191919", "#222222", "#2a2a2a", "#313131", "#3a3a3a", "#484848", "#606060", "#6e6e6e", "#7b7b7b", "#b4b4b4", "#eeeeee"],
  },
  // ---- Chromatic families (role-named in the semantic tier) ----
  teal: {
    light: ["#fafefd", "#f3fbf9", "#e0f8f3", "#ccf3ea", "#b8eae0", "#a1ded2", "#83cdc1", "#53b9ab", "#12a594", "#0d9b8a", "#008573", "#0d3d38"],
    dark: ["#0d1514", "#111c1b", "#0d2d2a", "#023b37", "#084843", "#145750", "#1c6961", "#207e73", "#12a594", "#0eb39e", "#0bd8b6", "#adf0dd"],
  },
  green: {
    light: ["#fbfefc", "#f4fbf6", "#e6f6eb", "#d6f1df", "#c4e8d1", "#adddc0", "#8eceaa", "#5bb98b", "#30a46c", "#2b9a66", "#218358", "#193b2d"],
    dark: ["#0e1512", "#121b17", "#132d21", "#113b29", "#174933", "#20573e", "#28684a", "#2f7c57", "#30a46c", "#33b074", "#3dd68c", "#b1f1cb"],
  },
  grass: {
    light: ["#fbfefb", "#f5fbf5", "#e9f6e9", "#daf1db", "#c9e8ca", "#b2ddb5", "#94ce9a", "#65ba74", "#46a758", "#3e9b4f", "#2a7e3b", "#203c25"],
    dark: ["#0e1511", "#141a15", "#1b2a1e", "#1d3a24", "#25482d", "#2d5736", "#366740", "#3e7949", "#46a758", "#53b365", "#71d083", "#c2f0c2"],
  },
  blue: {
    light: ["#fbfdff", "#f4faff", "#e6f4fe", "#d5efff", "#c2e5ff", "#acd8fc", "#8ec8f6", "#5eb1ef", "#0090ff", "#0588f0", "#0d74ce", "#113264"],
    dark: ["#0d1520", "#111927", "#0d2847", "#003362", "#004074", "#104d87", "#205d9e", "#2870bd", "#0090ff", "#3b9eff", "#70b8ff", "#c2e6ff"],
  },
  amber: {
    light: ["#fefdfb", "#fefbe9", "#fff7c2", "#ffee9c", "#fbe577", "#f3d673", "#e9c162", "#e2a336", "#ffc53d", "#ffba18", "#ab6400", "#4f3422"],
    dark: ["#16120c", "#1d180f", "#302008", "#3f2700", "#4d3000", "#5c3d05", "#714f19", "#8f6424", "#ffc53d", "#ffd60a", "#ffca16", "#ffe7b3"],
  },
  red: {
    light: ["#fffcfc", "#fff7f7", "#feebec", "#ffdbdc", "#ffcdce", "#fdbdbe", "#f4a9aa", "#eb8e90", "#e5484d", "#dc3e42", "#ce2c31", "#641723"],
    dark: ["#191111", "#201314", "#3b1219", "#500f1c", "#611623", "#72232d", "#8c333a", "#b54548", "#e5484d", "#ec5d5e", "#ff9592", "#ffd1d9"],
  },
} satisfies Record<string, RampPair>

export type RampName = keyof typeof ramps
