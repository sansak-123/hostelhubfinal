// src/data/mockRooms.js
// ──────────────────────────────────────────────
// Static mock data used by api.js.
// When you wire up Supabase, this file can be
// deleted — api.js will query the DB instead.
// ──────────────────────────────────────────────

export const BLOCKS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "S"];

export const BLOCK_TYPES = [
  "Non-AC",
  "Normal",
  "Non-Apartment",
  "Deluxe",
  "Apartment",
];

export const ROOM_TYPES = ["Bunk", "Non-Bunk"];

export const BED_OPTIONS = [1, 2, 3, 4, 5, 6];

export const MOCK_ROOMS = [
  {
    id: "1",
    block: "A",
    blockType: "Deluxe",
    roomType: "Non-Bunk",
    beds: 2,
    ratings: { wifi: 4, spaciousness: 5, cupboard: 4, overall: 4.5 },
    rank: 1,
    additionalInfo: "Corner room, great cross-ventilation.",
    photos: [],
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "2",
    block: "B",
    blockType: "Non-AC",
    roomType: "Bunk",
    beds: 4,
    ratings: { wifi: 3, spaciousness: 3, cupboard: 2, overall: 3 },
    rank: null,
    additionalInfo: "",
    photos: [],
    createdAt: "2024-01-11T11:00:00Z",
  },
  {
    id: "3",
    block: "C",
    blockType: "Apartment",
    roomType: "Non-Bunk",
    beds: 1,
    ratings: { wifi: 5, spaciousness: 4, cupboard: 5, overall: 4.8 },
    rank: 2,
    additionalInfo: "Studio-style apartment. Very quiet floor.",
    photos: [],
    createdAt: "2024-01-12T09:30:00Z",
  },
  {
    id: "4",
    block: "D",
    blockType: "Normal",
    roomType: "Bunk",
    beds: 6,
    ratings: { wifi: 2, spaciousness: 2, cupboard: 3, overall: 2.5 },
    rank: null,
    additionalInfo: "Near common room.",
    photos: [],
    createdAt: "2024-01-13T08:00:00Z",
  },
  {
    id: "5",
    block: "E",
    blockType: "Deluxe",
    roomType: "Non-Bunk",
    beds: 2,
    ratings: { wifi: 5, spaciousness: 5, cupboard: 4, overall: 5 },
    rank: 1,
    additionalInfo: "Best room in the block.",
    photos: [],
    createdAt: "2024-01-14T12:00:00Z",
  },
  {
    id: "6",
    block: "F",
    blockType: "Non-Apartment",
    roomType: "Bunk",
    beds: 3,
    ratings: { wifi: 3, spaciousness: 3, cupboard: 3, overall: 3 },
    rank: null,
    additionalInfo: "",
    photos: [],
    createdAt: "2024-01-15T14:00:00Z",
  },
  {
    id: "7",
    block: "G",
    blockType: "Non-AC",
    roomType: "Non-Bunk",
    beds: 2,
    ratings: { wifi: 4, spaciousness: 3, cupboard: 3, overall: 3.5 },
    rank: 3,
    additionalInfo: "Ground floor. Easy access.",
    photos: [],
    createdAt: "2024-01-16T07:00:00Z",
  },
  {
    id: "8",
    block: "H",
    blockType: "Apartment",
    roomType: "Non-Bunk",
    beds: 1,
    ratings: { wifi: 5, spaciousness: 5, cupboard: 5, overall: 5 },
    rank: 1,
    additionalInfo: "Top floor, city view.",
    photos: [],
    createdAt: "2024-01-17T16:00:00Z",
  },
  {
    id: "9",
    block: "J",
    blockType: "Normal",
    roomType: "Bunk",
    beds: 4,
    ratings: { wifi: 3, spaciousness: 2, cupboard: 2, overall: 2.5 },
    rank: null,
    additionalInfo: "",
    photos: [],
    createdAt: "2024-01-18T10:00:00Z",
  },
  {
    id: "10",
    block: "S",
    blockType: "Deluxe",
    roomType: "Non-Bunk",
    beds: 2,
    ratings: { wifi: 4, spaciousness: 4, cupboard: 4, overall: 4 },
    rank: 2,
    additionalInfo: "Newly renovated.",
    photos: [],
    createdAt: "2024-01-19T11:00:00Z",
  },
];
