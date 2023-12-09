// import { create } from "zustand";
// import { devtools, persist } from "zustand/middleware";

// interface itemState {
//   trafficSource: number;
//   setTrafficSource: (data: number) => void;
// }

// export const useTrafficSourceStore = create<itemState>()(
//   devtools(
//     persist(
//       (set) => ({
//         trafficSource: 0,
//         setTrafficSource: (data: number) =>
//           set((state) => ({ ...state, trafficSource: data })),
//       }),
//       { name: "trafficSourceStore" }
//     )
//   )
// );
