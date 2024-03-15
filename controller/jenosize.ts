/* eslint-disable no-eval */
/* eslint-disable no-restricted-syntax */
import axios from "axios";
import type { FastifyInstance } from "fastify";
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";

const googleMapKey = "AIzaSyAIFLj2onkl1L4CufB1-PsLA-F47S_3-Nk";

// const firebaseConfig = {
//   apiKey: "AIzaSyB0E5t0uZnz6R0PXQuOR7DVx7we2Gb-Gqg",
//   authDomain: "jenosize-bc15f.firebaseapp.com",
//   projectId: "jenosize-bc15f",
//   storageBucket: "jenosize-bc15f.appspot.com",
//   messagingSenderId: "77726164123",
//   appId: "1:77726164123:web:0a68835f35d4c9fd69523e",
// };
// const app = initializeApp(firebaseConfig);
export default async (fastify: FastifyInstance) => {
  fastify.post<{ Body: { search: string } }>(
    "/search",
    {
      schema: {
        // headers: { Authorization: { type: "string" } },
        body: { type: "object", properties: { search: { type: "string" } } },
      },
      // preValidation: fastify.authenticate,
    },
    async (req) => {
      const { search } = req.body;
      const axiosGoogleService = await axios({
        method: "POST",
        url: "https://places.googleapis.com/v1/places:searchText",
        headers: {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
          "Content-Type": "application/json",
          "X-Goog-Api-Key": googleMapKey,
          "X-Goog-FieldMask": "places.location,places.displayName,places.formattedAddress,places.priceLevel",
        },
        data: { textQuery: search, includedType: "restaurant", languageCode: "th" },
      });
      return axiosGoogleService.data;
    },
  );

  fastify.post<{ Body: { setNumbers: number[] } }>(
    "/game24",
    {
      schema: {
        // headers: { Authorization: { type: "string" } },
        body: {
          type: "object",
          properties: {
            setNumbers: { type: "array", maxItems: 4, items: { type: "number", enum: [1, 2, 3, 4, 5, 6, 7, 8, 9] } },
          },
        },
      },
      // preValidation: fastify.authenticate,
    },
    async (req) => {
      const { setNumbers } = req.body;
      const comboSymbol = [] as string[];
      const symbol = ["+", "-", "*", "/"] as string[];
      for (const one of symbol) {
        const text = one;
        for (const two of symbol) {
          const texttwo = text + two;
          for (const three of symbol) {
            comboSymbol.push(texttwo + three);
          }
        }
      }

      const comboNumber = [] as string[];
      const convert = setNumbers.map((e) => String(e));
      for (const one of convert) {
        const textone = one;
        for (const two of convert) {
          const texttwo = textone + two;
          for (const three of convert) {
            const textthree = texttwo + three;
            for (const four of convert) {
              comboNumber.push(textthree + four);
            }
          }
        }
      }

      const comboFull = [] as string[];
      for (const one of comboNumber) {
        const textone = one;
        for (const two of comboSymbol) {
          comboFull.push(textone + two);
        }
      }

      const arrayCombo = comboFull.map((e) => {
        const text = e.split("");
        return `${text[0]}${text[4]}${text[1]}${text[5]}${text[2]}${text[6]}${text[3]}`;
      });

      for (const e of arrayCombo) {
        console.log(eval(e));
        const cal = eval(e) as number;
        if (cal === 24) return "YES";
      }

      return "NO";
    },
  );

  fastify.post("/login", {}, async () => {
    return "login";
  });

  fastify.post<{ Body: { x: number[]; o: number[]; free: number[] } }>(
    "/xo",
    {
      schema: {
        // headers: { Authorization: { type: "string" } },
        body: {
          type: "object",
          properties: {
            x: { type: "array", items: { type: "number" } },
            o: { type: "array", items: { type: "number" } },
            free: { type: "array", items: { type: "number" } },
          },
        },
      },
      // preValidation: fastify.authenticate,
    },
    async (req) => {
      // รูปแบบที่สามารถชนะได้
      const winPlattern = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7],
      ];

      const { x, o, free } = req.body;
      let win = { player: "", match: [] } as { player: string; match: number[] }; // ตัวแปรสำหรับเก็บผู้ชนะ
      let almostWinRemain = 3 as number; // ตัวแปรสำหรับเก็บผู้ที่ใกล้ชนะ

      // เช็ค o ก่อนว่ามีรูปแบบที่จะชนะไหม
      const checko = winPlattern.map((array) => {
        const filteredArray = array.filter((e) => !o.includes(e));
        if (filteredArray.length === 0) win = { player: "o", match: array };
        if (almostWinRemain > filteredArray.length) almostWinRemain = filteredArray.length;
        return filteredArray;
      });

      // เช็ค x ก่อนว่ามีรูปแบบที่จะชนะไหม
      const checkx = winPlattern.map((array) => {
        const filteredArray = array.filter((e) => !x.includes(e));
        if (filteredArray.length === 0) win = { player: "x", match: array };
        if (almostWinRemain > filteredArray.length) almostWinRemain = filteredArray.length;
        return filteredArray;
      });

      // ถ้า x ชนะให้ return ออกไปเลย
      if (win.player) return { x, o, free, win };

      let nexto = 0 as number; // หา o ตัวต่อไป
      let choice = [] as number[]; // [] เก็วตัวเลือกให้ o

      // ค้นหาเลขที่ทำให้ o ชนะ
      checko
        .filter((e) => e.length === almostWinRemain)
        .map((e) =>
          e.forEach((a) => {
            if (free.includes(a)) choice.push(a);
          }),
        );

      // ค้นหาเลขที่ทำให้ x ไม่ชนะ
      if (choice.length === 0)
        checkx
          .filter((e) => e.length === almostWinRemain)
          .map((e) =>
            e.forEach((a) => {
              if (free.includes(a)) choice.push(a);
            }),
          );

      choice = [...new Set(choice)];

      // เลือก o จากตัวเลือกที่มี
      if (choice.length > 0) nexto = choice[Math.floor(Math.random() * choice.length)];
      else nexto = free[Math.floor(Math.random() * free.length)];

      // ตัดช่องที่ o เล่นออก
      const index = free.indexOf(nexto);
      if (index !== -1) {
        free.splice(index, 1);
      }
      o.push(nexto);

      // เช็คอีกครั้งว่าเมื่อ o แล้วชนะไหม
      winPlattern.map((array) => {
        const filteredArray = array.filter((e) => !o.includes(e));
        if (filteredArray.length === 0) win = { player: "o", match: array };
        return filteredArray;
      });

      return { x, o, free, win, nexto };
    },
  );
};

export const autoPrefix = "/";
