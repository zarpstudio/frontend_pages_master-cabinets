import { Button } from "@/presentation/components/atoms/ui/button";
import Link from "next/link";
import { ReactNode } from "react";
import { LegalPageConfig } from "@/types/legal-metadata";
import { RiFileTextLine, RiShieldLine } from "@remixicon/react";
import { CONTACT } from "@/constants";

const getIcon = (iconName: string) => {
  const icons = {
    FileText: <RiFileTextLine className="h-6 w-6" />,
    Shield: <RiShieldLine className="h-6 w-6" />,
  };
  return icons[iconName as keyof typeof icons] || null;
};

interface LegalLayoutProps {
  children: ReactNode;
  config: LegalPageConfig;
  currentPath?: string;
}

export default function LegalLayout({
  children,
  config,
  currentPath,
}: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-background mt-40">
      {/* Simple breadcrumb */}
      <div className="absolute top-20 left-0 w-full border-b bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            {currentPath && (
              <span className="text-foreground font-medium">
                {config?.title}
              </span>
            )}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Document header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {config?.icon && (
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {getIcon(config.icon)}
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {config?.title || "Legal Document"}
                </h1>
                {config?.lastUpdated && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Last updated: {config.lastUpdated}
                  </p>
                )}
              </div>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {config?.description || "Legal terms and policies for Master Cabinets LLC."}
            </p>
          </div>

          {/* Document content */}
          <div className="space-y-6">{children}</div>

          {/* Document footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="text-sm text-muted-foreground">
                <p>
                  If you have questions about this document, please contact us.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={CONTACT.phoneHref}>Call Us</Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`mailto:${CONTACT.email}`}>Email</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
