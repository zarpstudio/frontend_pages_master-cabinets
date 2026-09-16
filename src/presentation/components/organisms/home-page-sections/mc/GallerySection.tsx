import Image from "next/image";
import ActionButtonGroup from "@/presentation/components/molecules/mc/ActionButtonGroup";
import SectionHeading from "@/presentation/components/molecules/mc/SectionHeading";

/**
 * GallerySection - Figma node 48:9792 (GALLERY).
 *
 * The kit's bento rhythm - tall / small / wide / small / tall over two rows -
 * runs twice across 16 columns, so fourteen projects ride the marquee instead
 * of the original seven. The grid is then rendered twice more and the
 * marquee-left keyframe travels -50%, so the second copy lands exactly where
 * the first began and the loop is seamless.
 *
 * Hovering pauses it, and prefers-reduced-motion turns the rail back into a
 * plain horizontal scroller.
 */

const TILES = [
  // ---- block A (columns 1-8) ----
  {
    src: "/images/projects/luxury-kitchen-remodel-custom-cabinets.jpg",
    alt: "Luxury kitchen remodel with custom cabinetry - Master Cabinets",
    area: "[grid-column:1/3] [grid-row:1/3]",
  },
  {
    src: "/images/projects/modern-custom-kitchen-cabinetry.jpg",
    alt: "Modern custom kitchen cabinetry - Master Cabinets",
    area: "[grid-column:3/4] [grid-row:1/2]",
  },
  {
    src: "/images/projects/dark-wood-flooring-installation.jpg",
    alt: "Dark wood flooring installation - Master Cabinets",
    area: "[grid-column:4/6] [grid-row:1/2]",
  },
  {
    src: "/images/projects/bathroom_remodel_finished_02.jpg",
    alt: "Master bathroom remodel with custom vanity - Master Cabinets",
    area: "[grid-column:6/7] [grid-row:1/2]",
  },
  {
    src: "/images/projects/painting_flooring_hallway_finished_01.jpg",
    alt: "Interior hallway painting and flooring - Master Cabinets",
    area: "[grid-column:7/9] [grid-row:1/3]",
  },
  {
    src: "/images/projects/gray-custom-kitchen-cabinetry.jpg",
    alt: "Gray custom kitchen cabinetry - Master Cabinets",
    area: "[grid-column:3/5] [grid-row:2/3]",
  },
  {
    src: "/images/projects/remodeling_living-room_finished_01.jpg",
    alt: "Living room remodel with built-in storage - Master Cabinets",
    area: "[grid-column:5/7] [grid-row:2/3]",
  },

  // ---- block B (columns 9-16) ----
  {
    src: "/images/projects/custom-walk-in-closet-installation.jpg",
    alt: "Custom walk-in closet installation - Master Cabinets",
    area: "[grid-column:9/11] [grid-row:1/3]",
  },
  {
    src: "/images/projects/bathroom_remodel_finished_03.jpg",
    alt: "Spa-style bathroom suite - Master Cabinets",
    area: "[grid-column:11/12] [grid-row:1/2]",
  },
  {
    src: "/images/projects/custom-black-kitchen-cabinets.jpg",
    alt: "Black cabinetry with granite island - Master Cabinets",
    area: "[grid-column:12/14] [grid-row:1/2]",
  },
  {
    src: "/images/projects/custom-laundry-room-cabinetry.jpg",
    alt: "Custom laundry room cabinetry - Master Cabinets",
    area: "[grid-column:14/15] [grid-row:1/2]",
  },
  {
    src: "/images/projects/custom-outdoor-kitchen-cabinetry.jpg",
    alt: "Custom outdoor kitchen cabinetry - Master Cabinets",
    area: "[grid-column:15/17] [grid-row:1/3]",
  },
  {
    src: "/images/projects/white-kitchen-remodeling-project.jpg",
    alt: "White kitchen remodel with accent wall - Master Cabinets",
    area: "[grid-column:11/13] [grid-row:2/3]",
  },
  {
    src: "/images/projects/custom-built-in-entertainment-center.jpg",
    alt: "Built-in entertainment center - Master Cabinets",
    area: "[grid-column:13/15] [grid-row:2/3]",
  },
] as const;

/** One copy of the bento. Rendered twice to make the marquee loop seamless. */
function BentoCopy({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div
      // The trailing margin matches the internal gap, so one copy advances by
      // exactly its own width plus one gap - which is what -50% resolves to.
      className="mr-3 grid shrink-0 gap-3 [grid-template-columns:repeat(16,116px)] [grid-template-rows:repeat(2,120px)] sm:[grid-template-columns:repeat(16,150px)] sm:[grid-template-rows:repeat(2,155px)] lg:[grid-template-columns:repeat(16,186px)] lg:[grid-template-rows:repeat(2,192px)]"
      aria-hidden={duplicate}
    >
      {TILES.map((tile) => (
        <div
          key={tile.src}
          className={`rounded-[19px] bg-black/[0.04] p-1 shadow-[0_0_0_rgba(0,0,0,0.05)] ${tile.area}`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[16px] bg-[#E5DECD] shadow-[0_1px_1px_rgba(255,255,255,0.60)]">
            <Image
              src={tile.src}
              alt={duplicate ? "" : tile.alt}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 310px, 240px"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function GallerySection() {
  return (
    <section
      className="w-full bg-white py-10 lg:py-[40px]"
      aria-label="Featured work gallery"
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-8 px-4 sm:px-8">
        <SectionHeading
          line1="Featured Work"
          accent="Gallery"
          accentInline
          align="center"
          subtitle="A curated selection of our finest craftsmanship across different residential spaces - the meticulous detail in our materials and joinery."
        />
      </div>

      <div className="group mt-8 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="flex w-max animate-marquee-left [animation-duration:120s] group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          <BentoCopy />
          <BentoCopy duplicate />
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1440px] justify-center px-4 sm:px-8">
        <ActionButtonGroup className="sm:justify-center" />
      </div>
    </section>
  );
}
