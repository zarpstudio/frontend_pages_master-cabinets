// ---------------------------------------------------------------------------
// Service Images - Single Source of Truth
// ---------------------------------------------------------------------------

const P = "/images/projects";

export const HERO_CAROUSEL_IMAGES = [
  { src: `${P}/luxury-kitchen-remodel-custom-cabinets.jpg`, label: "Custom Cabinetry", id: 1 },
  { src: `${P}/bathroom_remodel_finished_01.jpg`, label: "Bathroom Remodeling", id: 2 },
  { src: `${P}/dark-wood-flooring-installation.jpg`, label: "Flooring Renovation", id: 3 },
] as const;

export const CATEGORY_1_IMAGES: string[] = [
  `${P}/luxury-kitchen-remodel-custom-cabinets.jpg`,
  `${P}/modern-custom-kitchen-cabinetry.jpg`,
  `${P}/custom-white-kitchen-cabinetry.jpg`,
];
export const CATEGORY_2_IMAGES: string[] = [
  `${P}/bathroom_remodel_finished_01.jpg`,
  `${P}/bathroom_remodel_finished_02.jpg`,
  `${P}/bathroom_remodel_finished_03.jpg`,
];
export const CATEGORY_3_IMAGES: string[] = [
  `${P}/dark-wood-flooring-installation.jpg`,
  `${P}/flooring-and-staircase-remodeling.jpg`,
  `${P}/residential-flooring-installation.jpg`,
];
export const CATEGORY_4_IMAGES: string[] = [
  `${P}/custom-walk-in-closet-installation.jpg`,
  `${P}/remodeling_living-room_finished_01.jpg`,
  `${P}/custom-outdoor-kitchen-cabinetry.jpg`,
];
