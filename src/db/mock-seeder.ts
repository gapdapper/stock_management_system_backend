import "@/config/env";
import db from "../db/connect";
import { reset } from "drizzle-seed";
import * as schema from "../db/schema";
import * as bcrypt from "bcryptjs";

const sizes = [
  "Size S", // 1
  "Size M", // 2
  "Size L", // 3
  "Size XL", // 4
  "No Size", // 5
  "Size M V2", // 6
  "Size L V2", // 7
];

const colors = [
  "Red", // 1
  "Blue", // 2
  "Green", // 3
  "Orange", // 4
  "Red White", // 5
  "Black White", // 6
  "New Red", // 7
  "New Green", // 8
  "Colorful", // 9
  "6 Point", // 10
  "9 Point", // 11
  "12 Point", // 12
  "White", // 13
  "No Color", // 14
];

const platforms = ["Shopee", "Lazada", "TikTok Shop"];
const paymentTypes = [
  "Credit Card",
  "Bank Transfer",
  "Promptpay",
  "COD",
  "TMN Express",
  "Shopee Wallet",
  "Airpay Wallet",
  "Airpay Credit Card",
  "Shopee Credit",
  "TikTok Pay Later",
  "Shopee Pay Later",
  "Other",
  "Shopee Pay",
  "True Money",
];

const mappings = [
  {
    productName: "Jackpot",
    variants: [
      { size: "Size S", color: "Red" },
      { size: "Size S", color: "Green" },
      { size: "Size S", color: "Blue" },
      { size: "Size L", color: "Red" },
      { size: "Size L", color: "Green" },
      { size: "Size L", color: "Blue" },
    ],
    platforms: [
      { platform: "shopee", sku: "jackpot" },
      { platform: "lazada", sku: "2880418441" },
      { platform: "lazada", sku: "2880325844" },
      { platform: "tiktok shop", sku: "jackpot-s-red" },
      { platform: "tiktok shop", sku: "jackpot-s-green" },
      { platform: "tiktok shop", sku: "jackpot-s-blue" },
      { platform: "tiktok shop", sku: "jackpot-l-red" },
      { platform: "tiktok shop", sku: "jackpot-l-green" },
      { platform: "tiktok shop", sku: "jackpot-l-blue" },
    ],
  },
  {
    productName: "Jackpot 4 Player",
    variants: [
      { size: "No Size", color: "New Red" },
      { size: "No Size", color: "Red" },
      { size: "No Size", color: "New Green" },
      { size: "No Size", color: "Green" },
      { size: "No Size", color: "Blue" },
    ],
    platforms: [
      { platform: "shopee", sku: "jackpot-4" },
      { platform: "lazada", sku: "4657068807" },
      { platform: "lazada", sku: "2878552272" },
      { platform: "tiktok shop", sku: "jackpot-l-blue" },
      { platform: "tiktok shop", sku: "jackpot-l-green" },
      { platform: "tiktok shop", sku: "jackpot-l-red" },
    ],
  },
  {
    productName: "Jackpot 4 Player Colorful",
    variants: [{ size: "No Size", color: "Colorful" }],
    platforms: [
      { platform: "shopee", sku: "jackpot-4-colorful" },
      { platform: "lazada", sku: "4657068807" },
      { platform: "lazada", sku: "2878552272" },
      { platform: "tiktok shop", sku: "jackpot-4-colorful" },
    ],
  },

  {
    productName: "Jackpot 6 Player",
    variants: [
      { size: "No Size", color: "Colorful" },
      { size: "No Size", color: "Green" },
    ],
    platforms: [
      { platform: "shopee", sku: "jackpot-6" },
      { platform: "lazada", sku: "5797681538" },
      // { platform: "tiktok shop", sku: "xx" },
    ],
  },
  {
    productName: "Jenga / Genga",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
      { size: "Size XL", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "genga-s" },
      { platform: "shopee", sku: "genga-m" },
      { platform: "shopee", sku: "genga-l" },
      { platform: "shopee", sku: "genga-xl" },
      { platform: "lazada", sku: "2882253239" },
      { platform: "lazada", sku: "3529934858" },
      { platform: "lazada", sku: "3529973631" },
      { platform: "lazada", sku: "3529927688" },
      { platform: "lazada", sku: "2882287114" },
      { platform: "tiktok shop", sku: "genga-s" },
      { platform: "tiktok shop", sku: "genga-m" },
      { platform: "tiktok shop", sku: "genga-l" },
      { platform: "tiktok shop", sku: "genga-xl" },
    ],
  },
  {
    productName: "Jenga Colorful / Genga Colorful",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
      { size: "Size M V2", color: "No Color" },
      { size: "Size L V2", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "genga-colorful" },
      { platform: "lazada", sku: "2879744625" },
      { platform: "lazada", sku: "2879777344" },
      { platform: "lazada", sku: "5136586547" },
      { platform: "tiktok shop", sku: "genga-s-v2-colorful" },
      { platform: "tiktok shop", sku: "genga-m-v2-colorful" },
      { platform: "tiktok shop", sku: "genga-l-v2-colorful" },
      { platform: "tiktok shop", sku: "genga-m-colorful" },
      { platform: "tiktok shop", sku: "genga-l-colorful" },
    ],
  },
  {
    productName: "Number Jenga",
    variants: [{ size: "Size L", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "genga-number" },
      { platform: "lazada", sku: "5896224349" },
      { platform: "tiktok shop", sku: "genganumber-l" },
    ],
  },
  {
    productName: "Domino",
    variants: [
      { size: "Size S", color: "6 Point" },
      { size: "Size L", color: "6 Point" },
      { size: "Size S", color: "9 Point" },
      { size: "Size L", color: "9 Point" },
      { size: "No Size", color: "12 Point" },
    ],
    platforms: [
      { platform: "shopee", sku: "domino" },
      { platform: "lazada", sku: "3687565040" },
      { platform: "lazada", sku: "3687416621" },
      { platform: "lazada", sku: "2976412875" },
      { platform: "lazada", sku: "2880138392" },
      { platform: "lazada", sku: "2880061677" },
      { platform: "tiktok shop", sku: "domino-s-6" },
      { platform: "tiktok shop", sku: "domino-s-9" },
      { platform: "tiktok shop", sku: "domino-l-6" },
      { platform: "tiktok shop", sku: "domino-l-9" },
      { platform: "tiktok shop", sku: "domino-12" },
    ],
  },
  {
    productName: "Trio Domino",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "domino-trio" },
      { platform: "lazada", sku: "2878559430" },
      { platform: "tiktok shop", sku: "domino-trio" },
    ],
  },
  {
    productName: "Tic Tac Toe",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "tictactoe" },
      { platform: "lazada", sku: "2882126548" },
      { platform: "tiktok shop", sku: "tictactoe" },
    ],
  },
  {
    productName: "Ludo Plug-in",
    variants: [
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "ludo-plugin" },
      { platform: "lazada", sku: "2882048247" },
      { platform: "tiktok shop", sku: "ludo-m-plugin" },
      { platform: "tiktok shop", sku: "ludo-l-plugin" },
    ],
  },
  {
    productName: "Ludo Ball",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "ludo-ball" },
      { platform: "lazada", sku: "3383025027" },
      { platform: "tiktok shop", sku: "ludo-ball" },
    ],
  },
  {
    productName: "Snake Cube",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "snakecube" },
      { platform: "lazada", sku: "2881988960" },
      { platform: "tiktok shop", sku: "snakecube" },
    ],
  },
  {
    productName: "Horse Race",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "horserace" },
      { platform: "lazada", sku: "2880298873" },
      { platform: "tiktok shop", sku: "horserace" },
    ],
  },
  {
    productName: "Folding Chinese Checkers",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size M", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "foldingchinesecheckers" },
      { platform: "lazada", sku: "3798100203" },
      { platform: "lazada", sku: "2880380175" },
      { platform: "tiktok shop", sku: "foldingchinesecheckers-m" },
      { platform: "tiktok shop", sku: "foldingchinesecheckers-l" },
    ],
  },
  {
    productName: "Chess",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
      { size: "Size XL", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "chess" },
      { platform: "lazada", sku: "3687538402" },
      { platform: "lazada", sku: "2880251595" },
      { platform: "lazada", sku: "2880267810" },
      { platform: "lazada", sku: "3130512715" },
      { platform: "tiktok shop", sku: "chess-s" },
      { platform: "tiktok shop", sku: "chess-m" },
      { platform: "tiktok shop", sku: "chess-l" },
      { platform: "tiktok shop", sku: "chess-xl" },
    ],
  },
  {
    productName: "English Magnet Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "lazada", sku: "5803510647" },
      { platform: "tiktok shop", sku: "englishmagneticchess" },
    ],
  },
  {
    productName: "Magnetic Checkers V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticcheckers-v2" },
      { platform: "lazada", sku: "5883250498" },
      { platform: "tiktok shop", sku: "magneticcheckers-v2" },
    ],
  },
  {
    productName: "English Chess with Draught Pieces",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "englishchesswithdraughtpieces" },
      { platform: "lazada", sku: "5798758681" },
      { platform: "tiktok shop", sku: "englishchesswithdraughtpieces" },
    ],
  },
  {
    productName: "English Chess V.3",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "englishchess-v3" },
      { platform: "lazada", sku: "5896360849" },
      { platform: "tiktok shop", sku: "englishchess-v3" },
    ],
  },
  {
    productName: "English Chess without Draught Pieces 3 in 1",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "englishchess-2in1" },
      { platform: "lazada", sku: "5849903003" },
      { platform: "tiktok shop", sku: "englishchesswithdraughtpieces-v2" },
    ],
  },
  {
    productName: "Chess 4 in 1",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "chess-4in1" },
      { platform: "lazada", sku: "5856840193" },
      { platform: "tiktok shop", sku: "chessset-4in1" },
    ],
  },
  {
    productName: "Black and White Chess",
    variants: [
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "black&whitechess" },
      { platform: "lazada", sku: "5857966702" },
      { platform: "tiktok shop", sku: "black&whitechess-m" },
      { platform: "tiktok shop", sku: "black&whitechess-l" },
    ],
  },
  {
    productName: "Chess Pieces",
    variants: [{ size: "Size XL", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "chesspieces-xl" },
      { platform: "lazada", sku: "3130606343" },
      { platform: "tiktok shop", sku: "chesspieces-xl" },
    ],
  },
  {
    productName: "Thai Chess Pieces",
    variants: [{ size: "Size XL", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "thaichesspieces-xl" },
      { platform: "lazada", sku: "5985607144" },
      { platform: "tiktok shop", sku: "thaichesspieces-xl" },
    ],
  },
  {
    productName: "Plastic Chess Pieces",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "plasticchesspieces" },
      { platform: "lazada", sku: "5865889965" },
      { platform: "tiktok shop", sku: "chesspieces-b&w-plastic" },
    ],
  },
  {
    productName: "Thai Chess Piece Plastic (Makruk)",
    variants: [
      { size: "No Size", color: "Black White" },
      { size: "No Size", color: "Red White" },
    ],
    platforms: [
      { platform: "shopee", sku: "thaichesspieceplastic-makruk" },
      { platform: "lazada", sku: "5860210221" },
      { platform: "tiktok shop", sku: "chesspieces-r&w" },
      { platform: "tiktok shop", sku: "chesspieces-b&w" },
    ],
  },
  {
    productName: "Thai Chess",
    variants: [
      { size: "Size L", color: "No Color" },
      { size: "Size XL", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "thaichess" },
      { platform: "lazada", sku: "5527891015" },
      { platform: "lazada", sku: "2882164261" },
      { platform: "tiktok shop", sku: "thaichess-l" },
      { platform: "tiktok shop", sku: "thaichess-xl" },
    ],
  },
  {
    productName: "Chinese Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "chinesechess" },
      { platform: "lazada", sku: "2880053263" },
      // { platform: "tiktok shop", sku: "xx" },
    ],
  },
  {
    productName: "Magnetic Chinese Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticchinesechess" },
      { platform: "lazada", sku: "5930839363" },
      { platform: "tiktok shop", sku: "magneticchinesechess" },
    ],
  },
  {
    productName: "Black & White Chess V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "black&whitechess-v2" },
      { platform: "lazada", sku: "5883100277" },
      { platform: "tiktok shop", sku: "black&whitechess-v2" },
    ],
  },
  {
    productName: "Chain Triangle Game",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "chaintriangle" },
      { platform: "lazada", sku: "5845827694" },
      { platform: "tiktok shop", sku: "chaintrianglegame" },
    ],
  },
  {
    productName: "Puppy Puzzle",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "puppypuzzle" },
      { platform: "lazada", sku: "5527363403" },
      { platform: "tiktok shop", sku: "puppypuzzle" },
    ],
  },
  {
    productName: "Airplane Puzzle",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "airplanepuzzle" },
      { platform: "lazada", sku: "5386318216" },
      { platform: "tiktok shop", sku: "airplanepuzzle" },
    ],
  },
  {
    productName: "Match 16",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "match16" },
      { platform: "lazada", sku: "2882121832" },
      { platform: "tiktok shop", sku: "match16" },
    ],
  },
  {
    productName: "Master Logic",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "masterlogic" },
      { platform: "lazada", sku: "2882056281" },
      { platform: "tiktok shop", sku: "masterlogic" },
    ],
  },
  {
    productName: "Snake & Ladder",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "snakeladder" },
      { platform: "lazada", sku: "2882093449" },
      { platform: "tiktok shop", sku: "snakeladder" },
    ],
  },
  {
    productName: "Magnet Snake & Ladder Board Set",
    variants: [
      { size: "Size S", color: "Green" },
      { size: "Size M", color: "Blue" },
      { size: "Size L", color: "Orange" },
    ],
    platforms: [
      { platform: "shopee", sku: "magnetsnakeladder" },
      { platform: "lazada", sku: "5861648898" },
      { platform: "tiktok shop", sku: "magneticsnakeladder-l" },
      { platform: "tiktok shop", sku: "magneticsnakeladder-m" },
      { platform: "tiktok shop", sku: "magneticsnakeladder-s" },
    ],
  },
  {
    productName: "Magnetic Othello",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticothello" },
      { platform: "lazada", sku: "5868207583" },
      { platform: "tiktok shop", sku: "magnetothello" },
    ],
  },
  {
    productName: "Othello",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "othello" },
      { platform: "lazada", sku: "2882091246" },
      { platform: "tiktok shop", sku: "othello" },
    ],
  },
  {
    productName: "Escape",
    variants: [
      { size: "Size S", color: "No Color" },
      { size: "Size M", color: "No Color" },
    ],

    platforms: [
      { platform: "shopee", sku: "escape" },
      { platform: "lazada", sku: "2997791265" },
      { platform: "lazada", sku: "2880220242" },
      { platform: "tiktok shop", sku: "escape" },
    ],
  },
  {
    productName: "4 in Row",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "4inrow" },
      { platform: "lazada", sku: "4718080076" },
      { platform: "tiktok shop", sku: "4inrow" },
    ],
  },
  {
    productName: "Kalaha",
    variants: [
      { size: "Size M", color: "No Color" },
      { size: "Size L", color: "No Color" },
    ],
    platforms: [
      { platform: "shopee", sku: "kalaha" },
      { platform: "lazada", sku: "5251473604" },
      { platform: "tiktok shop", sku: "kalaha-m" },
      { platform: "tiktok shop", sku: "kalaha-l" },
    ],
  },
  {
    productName: "Mahjong",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "mahjong" },
      { platform: "lazada", sku: "5251606203" },
      { platform: "tiktok shop", sku: "mahjong" },
    ],
  },
  {
    productName: "Card",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "card" },
      { platform: "lazada", sku: "5470641395" },
      // { platform: "tiktok shop", sku: "xx" },
    ],
  },
  {
    productName: "Wooden Draught Board",
    variants: [{ size: "Size M", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "woodendraughtboard" },
      { platform: "lazada", sku: "5386406112" },
      { platform: "tiktok shop", sku: "wooddraughtboard" },
    ],
  },
  {
    productName: "Magnetic Checkers Set",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticcheckersset" },
      { platform: "lazada", sku: "5861780483" },
      { platform: "tiktok shop", sku: "magneticcheckers" },
    ],
  },
  {
    productName: "Magnetic Chess",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticchess" },
      { platform: "lazada", sku: "5790619905" },
      { platform: "tiktok shop", sku: "magneticchess" },
    ],
  },
  {
    productName: "Magnetic Backgammon 3 in 1",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "magneticbackgammon-3in1" },
      { platform: "lazada", sku: "5873521207" },
      { platform: "tiktok shop", sku: "backgammon-3in1" },
    ],
  },
  {
    productName: "Backgammon",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "backgammon" },
      { platform: "lazada", sku: "5386363293" },
      { platform: "tiktok shop", sku: "backgammon" },
    ],
  },
  {
    productName: "Connect Four",
    variants: [{ size: "No Size", color: "No Color" }],

    platforms: [
      { platform: "shopee", sku: "connectfour" },
      { platform: "lazada", sku: "2880087454" },
      { platform: "tiktok shop", sku: "connectfour" },
    ],
  },
  {
    productName: "Connect Four V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "connectfour-v2" },
      { platform: "lazada", sku: "5930058348" },
      { platform: "tiktok shop", sku: "connectfour-v2" },
    ],
  },
  {
    productName: "Calendar",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "calendar" },
      { platform: "lazada", sku: "2880029138" },
      { platform: "tiktok shop", sku: "calendar" },
    ],
  },
  {
    productName: "Sling Shot",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "slingshot" },
      { platform: "lazada", sku: "4871067227" },
      { platform: "tiktok shop", sku: "slingshot" },
    ],
  },
  {
    productName: "Pool Game",
    variants: [
      { size: "No Size", color: "Red" },
      { size: "No Size", color: "Green" },
      { size: "No Size", color: "Blue" },
    ],
    platforms: [
      { platform: "shopee", sku: "poolgame" },
      { platform: "lazada", sku: "2882057965" },
      { platform: "tiktok shop", sku: "poolgame-red" },
      { platform: "tiktok shop", sku: "poolgame-green" },
      { platform: "tiktok shop", sku: "poolgame-blue" },
    ],
  },
  {
    productName: "1-6 Dice Roller V.2",
    variants: [{ size: "No Size", color: "No Color" }],
    platforms: [
      { platform: "shopee", sku: "1-6diceroller-v2" },
      { platform: "lazada", sku: "4786734843" },
      { platform: "tiktok shop", sku: "1-6diceroller-v2" },
    ],
  },
];

async function resetIdentitySequences() {
  const tables = [
    "users",
    "product",
    "product_size",
    "product_color",
    "product_variant",
    "payment_type",
    "platform",
    "transaction",
    "transaction_item",
    "platform_product_mapping",
    "daily_upload_log",
  ];

  for (const table of tables) {
    await db.execute(`
      SELECT setval(
        pg_get_serial_sequence('"${table}"', 'id'),
        1,
        false
      );
    `);
  }

  console.log("Identity sequences reset.");
}

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 10);

  // 1. reset
  await reset(db, schema);
  await resetIdentitySequences();

  // 2. prepare data from mappings
  const productNames = mappings.map((m) => m.productName);

  const orderedSizes = sizes;
  const orderedColors = colors;

  // 3. insert product
  const insertedProducts = await db
    .insert(schema.product)
    .values(productNames.map((name) => ({ productName: name })))
    .returning();

  const productMap = Object.fromEntries(
    insertedProducts.map((p) => [p.productName, p.id]),
  );

  // 4. insert size
  // size
  const insertedSizes = await db
    .insert(schema.productSize)
    .values(orderedSizes.map((s) => ({ size: s })))
    .returning();

  const sizeMap = Object.fromEntries(insertedSizes.map((s) => [s.size, s.id]));

  // color
  const insertedColors = await db
    .insert(schema.productColor)
    .values(orderedColors.map((c) => ({ color: c })))
    .returning();

  const colorMap = Object.fromEntries(
    insertedColors.map((c) => [c.color, c.id]),
  );

  // 6. insert platform
  const insertedPlatforms = await db
    .insert(schema.platform)
    .values(platforms.map((p) => ({ platformName: p })))
    .returning();

  const platformMap = Object.fromEntries(
    insertedPlatforms.map((p) => [p.platformName!.toLowerCase(), p.id]),
  );

  // 7. build variant + mapping rows
  const variantRows: any[] = [];
  const mappingRows: any[] = [];
  const baseDate = new Date(2026, 0, 4, 8, 0, 0);

  const getLastUpdated = (index: number) => {
    const d = new Date(baseDate);
    d.setMinutes(d.getMinutes() + index); // ไล่ทีละนาที
    return d;
  };
  let counter = 0;
  for (const p of mappings) {
    const productId = productMap[p.productName];

    // variants
    for (const v of p.variants) {
      variantRows.push({
        productId,
        sizeId: sizeMap[v.size],
        colorId: colorMap[v.color],
        qty: 50,
        minStock: 10,
        updatedAt: getLastUpdated(counter),
      });

      counter++;
    }

    // platform SKU mapping (parent level)
    for (const plat of p.platforms) {
      mappingRows.push({
        productId,
        platformId: platformMap[plat.platform.toLowerCase()],
        externalProductSku: plat.sku,
      });
    }
  }

  // 8. bulk insert
  await db.insert(schema.productVariant).values(variantRows);
  await db.insert(schema.platformProductMapping).values(mappingRows);

  // 9. payment + user + log (เหมือนเดิม)
  await db
    .insert(schema.paymentType)
    .values(paymentTypes.map((pt) => ({ paymentType: pt })));

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  await db.insert(schema.dailyUploadLog).values({
    uploadAt: yesterday,
  });

  await db.insert(schema.users).values([
    {
      username: "admin",
      password: adminPassword,
      role: "admin",
    },
    {
      username: "user",
      password: adminPassword,
      role: "user",
    },
  ]);
  // 10. mock transactions
  console.log("Seeding mock transactions...");

  // helper random
  const pickByIndex = <T>(arr: T[], index: number): T => {
    if (arr.length === 0) throw new Error("Array is empty");
    return arr[index % arr.length]!;
  };

  // fetch data ที่ต้องใช้
  const allVariants = await db.select().from(schema.productVariant);
  const allPlatforms = await db.select().from(schema.platform);
  const allPaymentTypes = await db.select().from(schema.paymentType);

  const statuses = [
    "order placed",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
    "returned",
  ] as const;

  const buyers = [
    "Somchai",
    "Suda",
    "Anan",
    "Kanya",
    "Narin",
    "Ploy",
    "Beam",
    "Mint",
  ];

  // เก็บ transaction ที่ insert
  const transactionRows: any[] = [];

  for (let i = 1; i <= 45; i++) {
    const orderId = `order-${String(i).padStart(2, "0")}`;

    const platform = pickByIndex(allPlatforms, i);
    const payment = pickByIndex(allPaymentTypes, i);
    const buyer = pickByIndex(buyers, i);

    const status = statuses[i % statuses.length];

    transactionRows.push({
      orderId,
      buyer,
      paymentTypeId: payment.id,
      shippingPostalCode: `${10000 + i}`, // deterministic
      platformId: platform.id,
      status,
      note: null,
    });
  }

  // insert transactions
  const insertedTransactions = await db
    .insert(schema.transaction)
    .values(transactionRows)
    .returning();

  // 11. mock transaction items
  const transactionItemRows: any[] = [];

  for (let i = 0; i < insertedTransactions.length; i++) {
    const trx = insertedTransactions[i];

    // fixed pattern: 1–3 items (วน pattern)
    const itemCount = (i % 3) + 1;

    for (let j = 0; j < itemCount; j++) {
      const variant = pickByIndex(allVariants, i + j);

      transactionItemRows.push({
        transactionId: trx?.id,
        productId: variant.productId,
        productVariantId: variant.id,
        quantity: ((i + j) % 5) + 1,
        externalProductSku: null,
        externalVariantText: null,
        createdAt: trx?.createdAt,
        updatedAt: trx?.createdAt,
      });
    }
  }

  // insert transaction items
  await db.insert(schema.transactionItem).values(transactionItemRows);

  console.log("Seeding February transactions...");

  const febTransactionRows: any[] = [];

  const febBaseDate = new Date(2026, 1, 1, 9, 0, 0);

  const getFebDate = (index: number) => {
    const d = new Date(febBaseDate);
    d.setDate(d.getDate() + (index % 28)); 
    d.setMinutes(d.getMinutes() + index);
    return d;
  };

  for (let i = 1; i <= 42; i++) {
    // จำนวนใกล้เคียง 45
    const orderId = `feb-order-${String(i).padStart(2, "0")}`;

    const platform = pickByIndex(allPlatforms, i + 100); 
    const payment = pickByIndex(allPaymentTypes, i + 100);
    const buyer = pickByIndex(buyers, i + 100);

    const status = statuses[i % statuses.length];

    febTransactionRows.push({
      orderId,
      buyer,
      paymentTypeId: payment.id,
      shippingPostalCode: `${20000 + i}`,
      platformId: platform.id,
      status,
      note: null,
      createdAt: getFebDate(i), 
    });
  }

  // insert feb transactions
  const insertedFebTransactions = await db
    .insert(schema.transaction)
    .values(febTransactionRows)
    .returning();

  const febTransactionItemRows: any[] = [];

  let febItemCounter = 0;

  for (let i = 0; i < insertedFebTransactions.length; i++) {
    const trx = insertedFebTransactions[i];

    // ใช้ pattern เดิม 1–3 items
    const itemCount = (i % 3) + 1;

    for (let j = 0; j < itemCount; j++) {
      const variant = pickByIndex(allVariants, febItemCounter);

      febTransactionItemRows.push({
        transactionId: trx?.id,
        productId: variant.productId,
        productVariantId: variant.id,
        quantity: (febItemCounter % 5) + 1, // pattern เดิม
        externalProductSku: null,
        externalVariantText: null,
        createdAt: trx?.createdAt, // ✅ เพิ่ม
        updatedAt: trx?.createdAt,
      });

      febItemCounter++; // สำคัญมาก → ทำให้ distribution smooth
    }
  }

  await db.insert(schema.transactionItem).values(febTransactionItemRows);

  console.log("February transaction items completed.");

  await db.insert(schema.transactionItem).values(febTransactionItemRows);

  console.log("February transactions completed.");

  console.log("Mock transactions completed.");

  console.log("Seeding completed.");
}

main();
