import { FIREBASE_DB } from "./utils/Auth/firebase_init.js";

const EDITIONS = [
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 250,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 750,
      sep: "Word",
      perExtraSep: 10,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Jaipur City",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 250,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 1114,
      sep: "Word",
      perExtraSep: 10,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Jaipur Edition",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 75,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 220,
      sep: "Word",
      perExtraSep: 8,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Udaipur",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 75,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 220,
      sep: "Word",
      perExtraSep: 8,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Kota",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 50,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 195,
      sep: "Word",
      perExtraSep: 8,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Sriganganagar",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
  {
    documents_config: {
      isDocuments: 1,
      docs: [
        {
          doc_name: "Photo",
          doc_type: "Png",
          max_size: 2,
          document_price: 50,
        },
      ],
    },
    price_config: {
      maxSep: 120,
      minSep: 30,
      minPrice: 195,
      sep: "Word",
      perExtraSep: 5,
    },
    misc_config: {
      discount: null,
      isInBuiltPhoto: false,
    },
    editionName: "Bharatpur",
    catName: "Obituratity",
    schemes: [],
    paller_config: {
      isMarker: false,
      colors: {
        isLightRed: false,
        isBlue: false,
        isYellow: false,
        isWhite: 100,
      },
      isTick: false,
      isBorder: false,
    },
  },
];

const pushtodb = async (ID,i) => {
  let response = await FIREBASE_DB.collection("EDITION_CONFIG_COLL")
    .doc(`12001_14002_${String(ID)}`)
    .set(EDITIONS[i-1]);
};

let MARK = 17000;
for (let i = 1; i <= EDITIONS.length; i++) {
  await pushtodb(MARK + i,i);
  console.log("Done\n");
}
