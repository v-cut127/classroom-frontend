import React, {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {Department} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
            },
            {
                id: 'name',
                accessorKey: 'name',
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue<string>()}</span>
            },
            {
                id: 'description',
                accessorKey: 'description',
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-1">{getValue<string>()}</span>
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                header: () => <p className="column-title">Created At</p>,
                cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString()
            }
        ], []),
        refineCoreProps: {
            resource: 'departments',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...searchFilters]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>
            <div className="intro-row">
                <p>Manage academic departments and their organization.</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or code..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <CreateButton />
                </div>
            </div>
            <DataTable table={departmentTable} />
        </ListView>
    );
};

export default DepartmentsList;
