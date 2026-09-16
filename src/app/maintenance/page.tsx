import { Metadata } from "next";
import MaintenancePage from "@/presentation/pages/maintance/MaintenancePage";
import { COMPANY_NAME } from "@/constants/business-info";

export const metadata: Metadata = {
  title: `Site Under Maintenance | ${COMPANY_NAME}`,
  description:
    "Master Cabinets website is currently undergoing scheduled maintenance. Please call us directly for inquiries and quotes.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Maintenance() {
  return <MaintenancePage />;
}
