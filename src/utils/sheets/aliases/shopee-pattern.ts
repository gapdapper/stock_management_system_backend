export const ShopeeProductPattern = [
  {
    productId: 1,
    productName: "Jenga / Genga",
    priority: 10,
    aliases: [/genga/i, /jenga/i, /คอนโดไม้/i, /ตึกถล่ม/i, /คอนโดไม้ตึกถล่ม/i],
    inlineVariant: {
      colorPatterns: [
        { colorId: 9, color: "Colorful", patterns: [/Colorful/i] },
      ],
      sizePatterns: [
        {
          sizeId: 2,
          size: "M",
          patterns: [/\bsize\s*M\b/i, /\bไซส์\s*M\b/i, /\bM\b/i],
        },
        {
          sizeId: 3,
          size: "L",
          patterns: [/\bsize\s*L\b/i, /\bไซส์\s*L\b/i, /\bL\b/i],
        },
        {
          sizeId: 1,
          size: "S",
          patterns: [/\bsize\s*S\b/i, /\bไซส์\s*S\b/i, /\bS\b/i],
        },
        {
          sizeId: 4,
          size: "XL",
          patterns: [/\bsize\s*XL\b/i, /\bไซส์\s*XL\b/i, /\bXL\b/i],
        },
      ],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/M/i] },
        { sizeId: 3, size: "L", patterns: [/L/i] },
        { sizeId: 1, size: "S", patterns: [/S/i] },
      ],
    },
  },
  {
    productId: 2,
    productName: "Domino",
    priority: 10,
    aliases: [/โดมิโน 2 ชั้น 6 จุด/i, /Domino/i, /6 จุด/i, /9 จุด/i, /12 จุด/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 10, color: "6-point", patterns: [/6\s*(point|pt|จุด)\b/i] },
        { colorId: 11, color: "9-point", patterns: [/9\s*(point|pt|จุด)\b/i] },
        {
          colorId: 12,
          color: "12-point",
          patterns: [/12\s*(point|pt|จุด)\b/i],
        },
      ],
      sizePatterns: [
        {
          sizeId: 1,
          size: "S",
          patterns: [
            /\b(size\s*[:\-]?\s*S|ไซส์\s*S)(?!\d)/i,
            /(^|[^0-9])S($|[^0-9])/i,
          ],
        },
        {
          sizeId: 3,
          size: "L",
          patterns: [
            /\b(size\s*[:\-]?\s*L|ไซส์\s*L)(?!\d)/i,
            /(^|[^0-9])L($|[^0-9])/i,
          ],
        },
        // special case for No Size
        { sizeId: 5, size: "No Size", patterns: [/12\s*(point|pt|จุด)\b/i] },
      ],
    },
  },
  {
    productId: 3,
    productName: "Sling Shot Game",
    priority: 50,
    aliases: [/sling shot game/i, /เกมกระดานฟุตบอลไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 4,
    productName: "Ludo - Plug In",
    priority: 50,
    aliases: [/ludo plug in/i, /เกมกระดานลูโด้ไม้/i, /แบบหมากเสียบ/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
      ],
    },
  },

  {
    productId: 5,
    productName: "Shut the Box / Jackpot 4 Players",
    priority: 100,
    aliases: [/jackpot 4 players/i, /แจ๊คพอต 4 ด้าน/i],
    inlineVariant: {
      colorPatterns: [
        { colorId: 9, color: "Colorful", patterns: [/Colorful/i] },
      ],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 2, color: "Blue", patterns: [/Blue/i] },
        { colorId: 3, color: "Green", patterns: [/Green/i] },
        { colorId: 7, color: "New Red", patterns: [/New style Red/i] },
        { colorId: 8, color: "New Green", patterns: [/New style Green/i] },
        { colorId: 1, color: "Red", patterns: [/Red/i] },
      ],
      sizePatterns: [],
    },
  },

  {
    productId: 6,
    productName: "4 in row / Bingo",
    priority: 50,
    aliases: [/4 in row/i, /เกมบิงโกไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 7,
    productName: "Santa Christmas Party Train",
    priority: 100,
    aliases: [/santa christmas party train/i, /รถไฟคุณลุงซานต้า/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 1, color: "Red", patterns: [/Red/i, /สีแดง/i] },
        { colorId: 3, color: "Green", patterns: [/Green/i, /สีเขียว/i] },
        { colorId: 13, color: "White", patterns: [/White/i, /สีขาว/i] },
      ],
      sizePatterns: [],
    },
  },

  {
    productId: 8,
    productName: "Thai Chess",
    priority: 10,
    aliases: [/thai chess/i, /หมากรุกไทย/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
        { sizeId: 4, size: "XL", patterns: [/\bXL\b/i] },
      ],
    },
  },

  {
    productId: 9,
    productName: "Magnetic Snake & Ladder",
    priority: 50,
    aliases: [/magnetic snake & ladders/i, /เกมบันไดงูแม่เหล็ก/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 4, color: "Orange", patterns: [/(Orange)/i] },
        { colorId: 2, color: "Blue", patterns: [/(Blue)/i] },
        { colorId: 3, color: "Green", patterns: [/(Green)/i] },
      ],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
        { sizeId: 1, size: "S", patterns: [/\bS\b/i] },
      ],
    },
  },

  {
    productId: 10,
    productName: "Magnetic Backgammon",
    priority: 50,
    aliases: [/magnetic backgammon/i, /แบ็กแกมมอนแม่เหล็กพับได้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 11,
    productName: "Kalaha",
    priority: 50,
    aliases: [/kalaha/i, /เกมหมากหลุมของเล่นไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
      ],
    },
  },

  {
    productId: 12,
    productName: "English Chess with Draught Pieces",
    priority: 10,
    aliases: [/english chess with draught pieces/i, /ชุดหมากรุกหมากฮอสไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 13,
    productName: "Plastic Chess Pieces",
    priority: 50,
    aliases: [/plastic chess pieces/i, /ตัวหมากรุกสากลพลาสติก/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 14,
    productName: "Shut the Box / Jackpot Game",
    priority: 10,
    aliases: [/jackpot game/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 1, color: "Red", patterns: [/Red/i] },
        { colorId: 2, color: "Blue", patterns: [/Blue/i] },
        { colorId: 3, color: "Green", patterns: [/Green/i] },
      ],
      sizePatterns: [
        { sizeId: 1, size: "S", patterns: [/\bS\b/i] },
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
      ],
    },
  },

  {
    productId: 15,
    productName: "Calendar Wooden Block",
    priority: 50,
    aliases: [/calendar wooden block/i, /ปฏิทินไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 16,
    productName: "Magnetic Checkers V.2",
    priority: 100,
    aliases: [/magnetic checkers v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 17,
    productName: "1-6 Dice Roller V.2",
    priority: 100,
    aliases: [/1-6 dice roller/i, /เกมลูกเต๋ามหัศจรรย์ V\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 18,
    productName: "Othello",
    priority: 10,
    aliases: [/(?<!magnet\s)othello/i, /เกมส์หมากพลิก/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 19,
    productName: "Tic Tac Toe",
    priority: 50,
    aliases: [/tic tac toe/i, /ทิค แทค โท/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 20,
    productName: "Draught Board",
    priority: 10,
    aliases: [/draught board/i, /กระดานหมากฮอส/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 21,
    productName: "Snake Cube",
    priority: 100,
    aliases: [/snake cube/i, /ลูกเต๋างู/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 22,
    productName: "Thai Chess Piece Plastic",
    priority: 100,
    aliases: [/thai chess piece plastic/i, /หมากรุกไทย พลาสติกตัวเงา/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        {
          colorId: 6,
          color: "Black-White",
          patterns: [/Black-White/i, /ดำ-ขาว/i, /ดำ ขาว/i],
        },
        {
          colorId: 5,
          color: "Red-White",
          patterns: [/Red-White/i, /แดง-ขาว/i, /แดง ขาว/i],
        },
      ],
      sizePatterns: [],
    },
  },

  {
    productId: 23,
    productName: "Classic Card Wooden Toy Game",
    priority: 100,
    aliases: [/classic card wooden toy game/i, /เกมส์การ์ดโยนลูกเต๋า/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 24,
    productName: "Horse Race",
    priority: 50,
    aliases: [/horse race/i, /เกมไม้ม้าแข่ง/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 25,
    productName: "Snake Ladder",
    priority: 10,
    aliases: [/snake ladder/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 26,
    productName: "Chess",
    priority: 10,
    aliases: [/chess size/i, /หมากรุกฝรั่ง/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
        { sizeId: 1, size: "S", patterns: [/\bS\b/i] },
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 4, size: "XL", patterns: [/\bXL\b/i] },
      ],
    },
  },

  {
    productId: 27,
    productName: "Connect Four",
    priority: 10,
    aliases: [/connect four/i, /เกมบิงโกของเล่นไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 28,
    productName: "Magnet Othello",
    priority: 100,
    aliases: [/magnet othello/i, /เกมโอเทลโล่แม่เหล็ก/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },

  {
    productId: 29,
    productName: "Shut the Box / Jackpot 6 Players",
    priority: 100,
    aliases: [/jackpot 6 players/i, /แจ็คพอต 6 ด้าน/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 9, color: "Colorful", patterns: [/Colorful/i] },
        { colorId: 3, color: "Green", patterns: [/Green/i] },
      ],
      sizePatterns: [],
    },
  },

  {
    productId: 30,
    productName: "Thai Chess (Makruk Thai) Set",
    priority: 100,
    aliases: [/thai chess \(makruk thai\)/i, /หมากรุกไทย กระดานไม้อัดพับได้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        {
          colorId: 6,
          color: "Black-White",
          patterns: [/Black-White/i, /ดำ-ขาว/i, /ดำ ขาว/i],
        },
        {
          colorId: 5,
          color: "Red-White",
          patterns: [/Red-White/i, /แดง-ขาว/i, /แดง ขาว/i],
        },
      ],
      sizePatterns: [],
    },
  },
  {
    productId: 31,
    productName: "Folding Chinese Checkers",
    priority: 100,
    aliases: [/folding chinese checkers/i, /ของเล่นไม้ ดาว6/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 1, size: "S", patterns: [/\bS\b/i] },
      ],
    },
  },
  {
    productId: 32,
    productName: "Number Jenga / Genga",
    priority: 100,
    aliases: [/number genga/i, /คอนโดไม้ตึกถล่มตัวเลขพร้อมลูกเต๋า/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [{ sizeId: 3, size: "L", patterns: [/\bL\b/i] }],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 33,
    productName: "Match 16",
    priority: 50,
    aliases: [/match 16/i, /มินิตัวเลข/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 34,
    productName: "Black & White Chess",
    priority: 100,
    aliases: [/black & white chess/i, /เกมกระดานหมากรุกแม่เหล็กพับได้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
      ],
    },
  },
  {
    productId: 35,
    productName: "Thai Chess Pieces",
    priority: 10,
    aliases: [/thai chess pieces/i, /ตัวหมากรุกไทย/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [{ sizeId: 4, size: "XL", patterns: [/\bXL\b/i] }],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 36,
    productName: "Escape",
    priority: 50,
    aliases: [/escape/i, /ขุนแผน/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [
        { sizeId: 2, size: "M", patterns: [/\bM\b/i] },
        { sizeId: 3, size: "L", patterns: [/\bL\b/i] },
      ],
    },
  },
  {
    productId: 37,
    productName: "Puppy Puzzle",
    priority: 50,
    aliases: [/puppy puzzle/i, /ตัวต่อไม้ 3 มิติ/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 38,
    productName: "Chinese Chess",
    priority: 10,
    aliases: [/chinese chess/i, /เกมกระดานหมากรุกจีน/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 39,
    productName: "Mahjong",
    priority: 50,
    aliases: [/mahjong/i, /ไพ่นกกระจอก/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 40,
    productName: "Wooden Pool Game",
    priority: 50,
    aliases: [/wooden pool game/i, /โต๊ะสนุกเกอร์ไม้/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        { colorId: 1, color: "Red", patterns: [/Red/i] },
        { colorId: 2, color: "Blue", patterns: [/Blue/i] },
        { colorId: 3, color: "Green", patterns: [/Green/i] },
      ],
      sizePatterns: [],
    },
  },
  {
    productId: 41,
    productName: "Chess Pieces",
    priority: 10,
    aliases: [/chess pieces/i, /ตัวหมากรุกฝรั่ง/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [{ sizeId: 4, size: "XL", patterns: [/\bXL\b/i] }],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 42,
    productName: "English Chess with Draught Pieces V.2",
    priority: 100,
    aliases: [/english chess with draught pieces v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 43,
    productName: "3 in 1 Magnetic Board Game",
    priority: 100,
    aliases: [/3in1 magnetic board game/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 44,
    productName: "English Magnetic Chess with Draught Pieces",
    priority: 100,
    aliases: [/english magnetic chess with draught pieces/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 45,
    productName: "Black & White Chess V.2",
    priority: 100,
    aliases: [/black & white chess v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 46,
    productName: "Super Combo Chess (English & Thai) V.2",
    priority: 100,
    aliases: [/super combo chess \(english & thai\) v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        {
          colorId: 5,
          color: "Red-White",
          patterns: [/Red-White/i, /แดง-ขาว/i],
        },
        {
          colorId: 6,
          color: "Black-White",
          patterns: [/Black-White/i, /ดำ-ขาว/i],
        },
      ],
      sizePatterns: [],
    },
  },
  {
    productId: 47,
    productName: "Super Combo Chess (English & Thai)",
    priority: 80,
    aliases: [/super combo chess \(english & thai\)/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [
        {
          colorId: 5,
          color: "Red-White",
          patterns: [/Red-White/i, /แดง-ขาว/i],
        },
        {
          colorId: 6,
          color: "Black-White",
          patterns: [/Black-White/i, /ดำ-ขาว/i],
        },
      ],
      sizePatterns: [],
    },
  },
  {
    productId: 48,
    productName: "English Chess V.3",
    priority: 100,
    aliases: [/english chess v\.3/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 49,
    productName: "Magnetic Chinese Chess",
    priority: 100,
    aliases: [/magnetic chinese chess/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 50,
    productName: "Ludo - Ball",
    priority: 50,
    aliases: [/ludo - ball/i, /แบบหมากกลม/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 51,
    productName: "Pull & Push Along Elephant",
    priority: 50,
    aliases: [/pull & push along elephant/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 52,
    productName: "Magnetic Checkers V.2",
    priority: 100,
    aliases: [/magnetic checkers v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 53,
    productName: "Draught Board with Chess Pieces",
    priority: 50,
    aliases: [/draught board with chess pieces/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [{ sizeId: 4, size: "XL", patterns: [/\bXL\b/i] }],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 54,
    productName: "Chess Pieces Set",
    priority: 10,
    aliases: [/chess pieces set/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 55,
    productName: "The Airplane Puzzle",
    priority: 50,
    aliases: [/the airplane puzzle/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 56,
    productName: "Magnetic Checkers",
    priority: 10,
    aliases: [/magnetic checkers/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 57,
    productName: "Magnetic Chess",
    priority: 10,
    aliases: [/magnetic chess/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 58,
    productName: "Chain Triangle Chess Game",
    priority: 50,
    aliases: [/chain triangle chess game/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 59,
    productName: "Draught Board with Thai Chess Pieces",
    priority: 50,
    aliases: [/draught board with thai chess pieces/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [{ sizeId: 4, size: "XL", patterns: [/\bXL\b/i] }],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 60,
    productName: "Super Combo Chess (English & Thai) V.3",
    priority: 100,
    aliases: [/super combo chess \(english & thai\) v\.3/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 61,
    productName: "Connect Four V.2",
    priority: 100,
    aliases: [/connect four v\.2/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
  {
    productId: 64,
    productName: "Trio Domino",
    priority: 100,
    aliases: [/trio domino/i],
    inlineVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
    externalVariant: {
      colorPatterns: [],
      sizePatterns: [],
    },
  },
];
