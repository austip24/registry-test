// export const roads = {
//   type: "FeatureCollection",
//   features: [
//     {
//       type: "Feature",
//       properties: {
//         road_id: 1,
//         name: "Main Street",
//       },
//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [-122.420679, 37.772537],
//           [-122.421, 37.773],
//           [-122.422, 37.7735],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         road_id: 2,
//         name: "Second Street",
//       },
//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [-122.423, 37.774],
//           [-122.424, 37.7745],
//           [-122.425, 37.775],
//         ],
//       },
//     },
//     {
//       type: "Feature",
//       properties: {
//         road_id: 3,
//         name: "Third Avenue",
//       },
//       geometry: {
//         type: "LineString",
//         coordinates: [
//           [-122.426, 37.776],
//           [-122.427, 37.7765],
//           [-122.428, 37.777],
//         ],
//       },
//     },
//   ],
// };

export const roads = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        road_id: 1,
        name: "Segment 1",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.420679, 37.772537],
          [-122.421, 37.773],
          [-122.422, 37.7735],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        road_id: 2,
        name: "Segment 2",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.422, 37.7735],
          [-122.423, 37.774],
          [-122.424, 37.7745],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        road_id: 3,
        name: "Segment 3",
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.424, 37.7745],
          [-122.425, 37.775],
          [-122.426, 37.7755],
        ],
      },
    },
  ],
};
