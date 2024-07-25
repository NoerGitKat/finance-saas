"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { Loader2, Plus, Tags } from "lucide-react";
import { columns } from "@/app/(dashboard)/categories/columns";
import useGetCategories from "@/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import useBulkDelete from "@/features/categories/api/use-bulk-delete";

const CategoriesPage = () => {
  const { toggleSheet } = useNewCategory();
  const { data, isLoading } = useGetCategories();
  const { mutate, isPending } = useBulkDelete();

  const isDisabled = isLoading || isPending;

  return (
    <section className="mx-auto -mt-24 w-full max-w-screen-2xl pb-10">
      <Card className="border-none drop-shadow-sm">
        {isLoading ? (
          <>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="flex h-[500px] w-full items-center justify-center">
                <Loader2 className="size-6 animate-spin text-slate-300" />
              </div>
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
              <CardTitle className="line-clamp-1 flex text-xl">
                <Tags className="mr-2" />
                Categories
              </CardTitle>
              <Button onClick={toggleSheet} size="sm">
                <Plus className="mr-2 size-4" /> Create new category
              </Button>
            </CardHeader>
            <CardContent>
              {data && (
                <DataTable
                  columns={columns}
                  data={data}
                  filterKey="name"
                  onDelete={(row) => {
                    const ids = row.map((category) => category.original.id);
                    mutate({ ids });
                  }}
                  disabled={isDisabled}
                />
              )}
            </CardContent>
          </>
        )}
      </Card>
    </section>
  );
};

export default CategoriesPage;
