"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLanguage } from "@/hooks/use-language";
import { manageLinksTranslations } from "@/languages/manage-links";
import { Copy, Edit, QrCode, Trash2, Search, BarChart2, ExternalLink, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Link, Clock, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toastsTranslations } from "@/languages/toasts";

interface CustomLink {
  _id: string;
  originalLink: string;
  customLink: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
}

export default function ManageLinks() {
  const { status } = useSession();
  const { language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [links, setLinks] = useState<CustomLink[]>([])
  const [totalLinksCount, setTotalLinksCount] = useState(0);
  const [totalClicksCount, setTotalClicksCount] = useState(0);
  const [averageClicks, setAverageClicks] = useState(0);
  const [lastCreation, setLastCreation] = useState("");
  const router = useRouter();
  const translate = manageLinksTranslations[language];
  const tt = toastsTranslations[language];

  const fetchAllLinks = async () => {
    try {
      const response = await fetch("/api/custom-links/get-all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToShortenLink,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { customLinks } = data;

      setLinks(customLinks);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchLinks,
        duration: 3000,
      });
    }
  }

  const fetchTotalLinksCount = async () => {
    try {
      const response = await fetch("/api/custom-links/count-links", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToFetchLinkCount,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { count } = data;
      setTotalLinksCount(count);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchLinkCount,
        duration: 3000,
      });
    }
  }

  const fetchTotalClicksCount = async () => {
    try {
      const response = await fetch("/api/custom-links/click-count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToFetchClickCount,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { totalClicks } = data;
      console.log(data)
      setTotalClicksCount(totalClicks);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchClickCount,
        duration: 3000,
      });
    }
  }

  const fetchAverageClicksCount = async () => {
    try {
      const response = await fetch("/api/custom-links/average-clicks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToFetchAverageClickCount,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      let { averageClicks } = data;

      if (averageClicks === null || averageClicks === undefined) {
        averageClicks = 0;
      } else {
        averageClicks = Math.round(averageClicks);
      }
      setAverageClicks(averageClicks);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchAverageClickCount,
        duration: 3000,
      });
    }
  }

  const lastCreatedLink = async () => {
    try {
      const response = await fetch("/api/custom-links/last-creation", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        toast(tt.error, {
          description: tt.failedToFetchLastLinkCreated,
          duration: 3000,
        });
        return;
      }

      const data = await response.json();
      const { lastCreated } = data;
      setLastCreation(lastCreated);
    } catch (error) {
      console.log(error);
      toast(tt.error, {
        description: tt.failedToFetchLastLinkCreated,
        duration: 3000,
      });
    }
  }

  useEffect(() => {
    if (status === "unauthenticated") {
      toast(tt.error, {
        description: tt.unauthorized,
        duration: 3000,
      });
      router.push("/login")
    }

    if (status === "authenticated") {
      fetchAllLinks();
      fetchTotalLinksCount();
      fetchTotalClicksCount();
      fetchAverageClicksCount();
      lastCreatedLink();
    }
  }, [status])

  return (
    <section className="flex flex-col mt-10 py-12 md:py-16 px-4 md:px-6 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {translate.title || "Manage Links"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          {translate.description || "View and manage all your shortened links in one place. Track performance, edit, and organize your links efficiently."}
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { title: translate.totalLinks || "Total Links", value: totalLinksCount, icon: <Link className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> },
          { title: translate.totalClicks || "Total Clicks", value: totalClicksCount, icon: <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> },
          { title: translate.averageClicks || "Avg. Clicks", value: averageClicks, icon: <BarChart2 className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> },
          { title: translate.lastCreated || "Last Created", value: lastCreation, icon: <Clock className="w-4 h-4 md:w-5 md:h-5 text-blue-500" /> }
        ].map((stat, index) => (
          <Card key={index} className="border shadow-sm">
            <CardContent className="flex items-center p-6">
              <div className="rounded-full p-2 bg-primary/10 text-primary mr-4">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                <h4 className="text-2xl font-bold">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={translate.searchLinks || "Search links..."}
            className="pl-10 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{translate.filter || "Filter"}</span>
          </Button>
          <Button className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/custom-links")}>
            <Plus className="h-4 w-4" />
            <span>{translate.newLink || "New Link"}</span>
          </Button>
        </div>
      </div>

      {/* Links Table */}
      <Card className="border shadow-sm overflow-hidden mb-6 px-3">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">No.</TableHead>
                <TableHead className="max-w-xs">{translate.originalLink || "Original Link"}</TableHead>
                <TableHead>{translate.customLink || "Custom Link"}</TableHead>
                <TableHead>{translate.createdAt || "Created At"}</TableHead>
                <TableHead>{translate.clicks || "Clicks"}</TableHead>
                <TableHead className="text-right">{translate.actions || "Actions"}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {links.map((link, index) => (
                <TableRow key={link._id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="truncate inline-block max-w-xs">
                          {link.originalLink}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{link.originalLink}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="font-medium">
                    <a
                      href={`https://${link.customLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary transition-colors"
                    >
                      {link.customLink}
                      <ExternalLink className="ml-1 h-3 w-3 inline" />
                    </a>
                  </TableCell>
                  <TableCell>{new Date(link.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/10 hover:bg-primary/20">
                      {link.clicks}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Copy className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translate.copy || "Copy"}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <QrCode className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translate.qrCode || "QR Code"}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translate.edit || "Edit"}</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{translate.delete || "Delete"}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Pagination */}
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Empty State - Shown when no links are present */}
      {links.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent flex flex-col items-center justify-center p-12 text-center">
          <div className="rounded-full p-3 bg-primary/10 text-primary mb-4">
            <Link className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-medium mb-2">
            {translate.noLinksYet || "No links yet"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
            {translate.noLinksDescription || "Create your first shortened link to start tracking clicks and managing your URLs."}
          </p>
          <Button variant="default" className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/custom-links")}>
            {translate.createFirstLink || "Create Your First Link"}
          </Button>
        </Card>
      )}
    </section>
  );
}