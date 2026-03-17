import React, {useMemo, useState} from 'react'
import {ListView} from "@/components/refine-ui/views/list-view.tsx";
import {Breadcrumb} from "@/components/refine-ui/layout/breadcrumb.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {CreateButton} from "@/components/refine-ui/buttons/create.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {User} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    const roleFilters = selectedRole === 'all' ? [] : [
        { field: 'role', operator: 'eq' as const, value: selectedRole }
    ];
    const searchFilters = searchQuery ? [
        { field: 'name', operator: 'contains' as const, value: searchQuery }
    ] : [];

    const userTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(() => [
            {
                id: 'user',
                header: () => <p className="column-title ml-2">User</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarImage src={row.original.image || ''} />
                            <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium text-foreground">{row.original.name}</span>
                            <span className="text-xs text-muted-foreground">{row.original.email}</span>
                        </div>
                    </div>
                )
            },
            {
                id: 'role',
                accessorKey: 'role',
                header: () => <p className="column-title">Role</p>,
                cell: ({ getValue }) => {
                    const role = getValue<string>();
                    return (
                        <Badge variant={role === 'admin' ? 'destructive' : role === 'teacher' ? 'default' : 'secondary'}>
                            {role}
                        </Badge>
                    );
                }
            },
            {
                id: 'createdAt',
                accessorKey: 'createdAt',
                header: () => <p className="column-title">Joined</p>,
                cell: ({ getValue }) => new Date(getValue<string>()).toLocaleDateString()
            }
        ], []),
        refineCoreProps: {
            resource: 'users',
            pagination: { pageSize: 10, mode: 'server' },
            filters: {
                permanent: [...roleFilters, ...searchFilters]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Users</h1>
            <div className="intro-row">
                <p>Manage all users and their roles in the system.</p>
                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />
                        <Input
                            type="text"
                            placeholder="Search by name or email..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select value={selectedRole} onValueChange={setSelectedRole}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="student">Student</SelectItem>
                                <SelectItem value="teacher">Teacher</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <DataTable table={userTable} />
        </ListView>
    );
};

export default UsersList;
