import React from 'react';
import { useApiUrl, useCustom } from '@refinedev/core';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    Building
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
    const apiUrl = useApiUrl();
    const { data, isLoading } = useCustom({
        url: `${apiUrl}/stats`,
        method: "get",
    });

    const stats = data?.data;

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading dashboard metrics...</div>;
    }

    const metrics = stats?.metrics || { totalUsers: 0, totalClasses: 0, totalEnrollments: 0 };
    const usersByRole = stats?.usersByRole || [];
    const classesByDept = stats?.classesByDept || [];
    const capacityStatus = stats?.capacityStatus || [];

    const capacityData = capacityStatus.slice(0, 5).map((item: any) => ({
        name: item.className,
        enrolled: item.enrolledCount,
        capacity: item.capacity,
        remaining: Math.max(0, item.capacity - item.enrolledCount)
    }));

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-gradient-orange">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your classroom management system.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered accounts</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalClasses}</div>
                        <p className="text-xs text-muted-foreground">Across all departments</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics.totalEnrollments}</div>
                        <p className="text-xs text-muted-foreground">Student course entries</p>
                    </CardContent>
                </Card>
                <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Class Size</CardTitle>
                        <BookOpen className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics.totalClasses > 0 ? (metrics.totalEnrollments / metrics.totalClasses).toFixed(1) : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Students per class</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Classes by Department</CardTitle>
                        <CardDescription>Number of active classes per academic department.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={classesByDept}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="departmentName" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Bar dataKey="count" fill="url(#colorOrange)" radius={[4, 4, 0, 0]} />
                                <defs>
                                    <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>User Distribution</CardTitle>
                        <CardDescription>Breakdown of users by their system roles.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={usersByRole}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="role"
                                >
                                    {usersByRole.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3 shadow-sm">
                    <CardHeader>
                        <CardTitle>Capacity Status</CardTitle>
                        <CardDescription>Enrolled vs Remaining capacity for top classes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={capacityData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                                <XAxis type="number" stroke="#6b7280" />
                                <YAxis dataKey="name" type="category" width={100} stroke="#6b7280" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="enrolled" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                                <Bar dataKey="remaining" stackId="a" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-4 shadow-sm">
                    <CardHeader>
                        <CardTitle>Enrollment Trends</CardTitle>
                        <CardDescription>Student enrollments over the current period.</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={[
                                { name: 'Mon', count: 4 },
                                { name: 'Tue', count: 7 },
                                { name: 'Wed', count: 5 },
                                { name: 'Thu', count: 12 },
                                { name: 'Fri', count: 8 },
                                { name: 'Sat', count: 2 },
                                { name: 'Sun', count: 3 },
                            ]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            
            <div className="grid gap-4">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>System Warnings</CardTitle>
                        <CardDescription>Important notifications about system capacity.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {capacityStatus.filter((c:any) => c.enrolledCount >= c.capacity * 0.9).map((c:any) => (
                                <div key={c.classId} className="flex items-center gap-4 p-4 border rounded-xl bg-orange-50 border-orange-200 hover:bg-orange-100 transition-colors duration-200">
                                    <AlertCircle className="h-6 w-6 text-orange-600 shrink-0" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-orange-900">{c.className}</p>
                                        <p className="text-sm text-orange-700">Nearly full: {c.enrolledCount} / {c.capacity} students enrolled ({Math.round(c.enrolledCount/c.capacity * 100)}%)</p>
                                    </div>
                                    <Badge variant="outline" className="border-orange-300 text-orange-700 bg-white">Critical</Badge>
                                </div>
                            ))}
                            {capacityStatus.filter((c:any) => c.enrolledCount >= c.capacity * 0.9).length === 0 && (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
                                    <CheckCircle2 className="h-10 w-10 text-green-500 opacity-50" />
                                    <p>All classes have healthy capacity levels.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
