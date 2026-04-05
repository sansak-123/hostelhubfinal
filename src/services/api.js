// import { supabase } from "./supabase";

// /* ---------------- ROOM FUNCTIONS ---------------- */

// // fetch rooms with filters
// export const getRooms = async (filters) => {
//   let query = supabase.from("rooms").select("*");

//   if (filters.block) {
//     query = query.eq("block", filters.block);
//   }

//   if (filters.blockType) {
//     query = query.eq("block_type", filters.blockType);
//   }

//   if (filters.roomType) {
//     query = query.eq("room_type", filters.roomType);
//   }

//   if (filters.beds) {
//     query = query.eq("beds", filters.beds);
//   }

//   const { data, error } = await query;

//   if (error) {
//     console.log(error);
//     return [];
//   }

//   return data;
// };

// // add room
// export const addRoom = async (room) => {
//   const payload = {
//     block: room.block,
//     block_type: room.blockType,
//     room_type: room.roomType,
//     beds: room.beds,
//     wifi_rating: room.ratings.wifi,
//     room_spaciousness: room.ratings.spaciousness,
//     cupboard_spaciousness: room.ratings.cupboard,
//     overall_rating: room.ratings.overall,
//     rank: room.rank,
//     additional_info: room.additionalInfo,
//   };

//   const { data, error } = await supabase.from("rooms").insert([payload]);

//   if (error) {
//     console.log(error);
//     throw error;
//   }

//   return data;
// };

// /* ---------------- COMPLAINT FUNCTIONS ---------------- */

// export const submitComplaint = async (complaint) => {
//   const payload = {
//     category: complaint.category,
//     description: complaint.description,
//     status: "submitted",
//   };

//   const { data, error } = await supabase.from("complaints").insert([payload]);

//   if (error) {
//     console.log(error);
//     throw error;
//   }

//   return data;
// };

// export const getComplaints = async () => {
//   const { data, error } = await supabase
//     .from("complaints")
//     .select("*")
//     .order("created_at", { ascending: false });

//   if (error) {
//     console.log(error);
//     return [];
//   }

//   return data;
// };

// export const resolveComplaint = async (id) => {
//   const { data, error } = await supabase
//     .from("complaints")
//     .update({ status: "resolved" })
//     .eq("id", id);

//   if (error) {
//     console.log(error);
//   }

//   return data;
// };

// src/services/api.js
// ─────────────────────────────────────────────────────────────────
//  API ABSTRACTION LAYER
//
//  All data access goes through this file.
//  Currently uses in-memory mock data.
//
//  TO CONNECT SUPABASE LATER:
//    1. npm install @supabase/supabase-js
//    2. Create src/services/supabaseClient.js:
//         import { createClient } from '@supabase/supabase-js';
//         export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
//    3. Replace each function body below with the corresponding
//       Supabase query (marked with // SUPABASE: comments).
// ─────────────────────────────────────────────────────────────────

import { MOCK_ROOMS } from "../data/mockRooms";

// In-memory store that simulates a DB table.
// Remove this once Supabase is connected.
let _rooms = [...MOCK_ROOMS];

/**
 * Fetch rooms with optional filters.
 *
 * @param {Object} filters
 * @param {string}   filters.block      - e.g. 'A'
 * @param {string}   filters.blockType  - e.g. 'Deluxe'
 * @param {string}   filters.roomType   - 'Bunk' | 'Non-Bunk'
 * @param {number}   filters.beds       - 1–6
 * @returns {Promise<Array>}
 */
export async function getRooms(filters = {}) {
  // ── MOCK IMPLEMENTATION ────────────────────────────────────────
  // Simulates async network call.
  await _delay(400);

  let results = [..._rooms];

  if (filters.block) results = results.filter((r) => r.block === filters.block);
  if (filters.blockType)
    results = results.filter((r) => r.blockType === filters.blockType);
  if (filters.roomType)
    results = results.filter((r) => r.roomType === filters.roomType);
  if (filters.beds)
    results = results.filter((r) => r.beds === Number(filters.beds));

  return results;

  // ── SUPABASE REPLACEMENT ───────────────────────────────────────
  // import { supabase } from './supabaseClient';
  //
  // let query = supabase.from('rooms').select('*');
  //
  // if (filters.block)     query = query.eq('block', filters.block);
  // if (filters.blockType) query = query.eq('block_type', filters.blockType);
  // if (filters.roomType)  query = query.eq('room_type', filters.roomType);
  // if (filters.beds)      query = query.eq('beds', filters.beds);
  //
  // const { data, error } = await query;
  // if (error) throw error;
  // return data;
}

/**
 * Add a new room review.
 *
 * @param {Object} roomData  - matches shape of a room object
 * @returns {Promise<Object>} newly created room
 */
export async function addRoom(roomData) {
  // ── MOCK IMPLEMENTATION ────────────────────────────────────────
  await _delay(600);

  const newRoom = {
    ...roomData,
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
  };
  _rooms = [newRoom, ..._rooms];
  return newRoom;

  // ── SUPABASE REPLACEMENT ───────────────────────────────────────
  // import { supabase } from './supabaseClient';
  //
  // const { data, error } = await supabase
  //   .from('rooms')
  //   .insert([roomData])
  //   .select()
  //   .single();
  //
  // if (error) throw error;
  // return data;
}

// Utility: simulates network latency in mock mode
function _delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
