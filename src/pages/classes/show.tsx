import React, {useState} from 'react'
import {useShow, useApiUrl, useCustom, useNotification} from "@refinedev/core";
import {ClassDetails, User} from "@/types";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import { AdvancedImage } from "@cloudinary/react"
import {bannerPhoto} from "@/lib/cloudinary.ts";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Users, UserPlus, UserMinus, AlertCircle} from "lucide-react";
import axios from "axios";

const Show = () => {
    const { query } = useShow<ClassDetails>({ resource: "classes" });
    const apiUrl = useApiUrl();
    const { open } = useNotification();
    const [isActionLoading, setIsActionLoading] = useState(false);

    const classDetails = query.data?.data;
    const { isLoading, isError, refetch } = query;

    // Fetch enrolled students
    const { data: enrollmentData, isLoading: isEnrollmentLoading, refetch: refetchEnrollments } = useCustom<User[]>({
        url: `${apiUrl}/enrollments/class/${classDetails?.id}`,
        method: "get",
        queryOptions: {
            enabled: !!classDetails?.id,
        }
    });

    const enrolledStudents = enrollmentData?.data || [];

    if(isLoading || isError || !classDetails) {
        return(
            <ShowView className="class-view class-show">
                <ShowViewHeader resource="classes" title="Class Details"/>

                <p className="state-message">
                    {isLoading ? 'Loading class details ...' : isError ? 'Failed to load class details ...' : 'Class details not found'}
                </p>
            </ShowView>
        )
    }

    const unenrollStudent = async (studentId: string) => {
        setIsActionLoading(true);
        try {
            await axios.delete(`${apiUrl}/enrollments/${classDetails.id}/${studentId}`);
            open?.({
                type: "success",
                message: "Student unenrolled successfully",
            });
            refetchEnrollments();
        } catch (error) {
            open?.({
                type: "error",
                message: "Failed to unenroll student",
            });
        } finally {
            setIsActionLoading(false);
        }
    };

    const teacherName = classDetails.teacher?.name ?? "Unknown";
    const teacherInitials =
        teacherName
            .split(' ')
            .filter(Boolean)
            .slice(0,2)
            .map((part) => part[0]?.toUpperCase())
            .join('')

    const placeholderUrl = `https://placeholder.co/600x400?text=${encodeURIComponent(teacherInitials || 'NA')}`;

    const { name,
        description,
        status,
        capacity,
        bannerCldPubId,
        subject,
        teacher,
        department } = classDetails;

    const isFull = enrolledStudents.length >= capacity;

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader resource="classes" title="Class Details"/>

            <div className="banner h-64 overflow-hidden rounded-xl mb-6 shadow-md border">
                {classDetails.bannerUrl ? (
                    <AdvancedImage className="w-full h-full object-cover" alt="Class Banner" cldImg={bannerPhoto(bannerCldPubId ?? "", name)}/>
                ) : <div className="placeholder w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Banner Image</div>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="details-card overflow-hidden">
                        <CardHeader className="bg-muted/30 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-3xl font-bold">{name}</CardTitle>
                                    <p className="text-muted-foreground mt-2">{description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="px-3 py-1">
                                        {enrolledStudents.length} / {capacity} Students
                                    </Badge>
                                    <Badge variant={status === 'active' ? 'default' : 'secondary'} className="px-3 py-1">
                                        {status.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-8">
                            <div className="grid sm:grid-cols-2 gap-8">
                                <div className="instructor space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <Users className="h-4 w-4" /> Instructor
                                    </h3>
                                    <div className="flex items-center gap-4 p-3 rounded-lg border bg-card/50">
                                        <Avatar className="h-12 w-12 border">
                                            <AvatarImage src={teacher?.image ?? placeholderUrl} />
                                            <AvatarFallback>{teacherInitials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-foreground">{teacherName}</p>
                                            <p className="text-sm text-muted-foreground">{teacher?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="department space-y-3">
                                    <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Department</h3>
                                    <div className="p-3 rounded-lg border bg-card/50 h-[74px] flex flex-col justify-center">
                                        <p className="font-bold text-foreground">{department?.name}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{department?.description}</p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="subject space-y-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject Information</h3>
                                <div className="p-4 rounded-lg border bg-card/50 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Badge variant="secondary" className="font-mono">CODE: {subject?.code}</Badge>
                                        <p className="font-bold text-lg">{subject?.name}</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground italic">{subject?.description}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="enrolled-students shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Users className="h-5 w-5" /> Enrolled Students
                            </CardTitle>
                            <Button size="sm" variant="outline" className="gap-1">
                                <UserPlus className="h-4 w-4" /> Enroll Student
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {isEnrollmentLoading ? (
                                    <p className="text-center py-4 text-muted-foreground">Loading students...</p>
                                ) : enrolledStudents.length === 0 ? (
                                    <div className="text-center py-8 border-2 border-dashed rounded-xl">
                                        <p className="text-muted-foreground">No students enrolled yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y rounded-lg border">
                                        {enrolledStudents.map((student) => (
                                            <div key={student.id} className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-9 w-9">
                                                        <AvatarImage src={student.image || ""} />
                                                        <AvatarFallback>{student.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium leading-none">{student.name}</p>
                                                        <p className="text-xs text-muted-foreground">{student.email}</p>
                                                    </div>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 px-2"
                                                    onClick={() => unenrollStudent(student.id)}
                                                    disabled={isActionLoading}
                                                >
                                                    <UserMinus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg border-none">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5" /> Join This Class
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm space-y-2">
                                <p className="text-sm font-medium opacity-90 italic">Invite Code</p>
                                <div className="flex items-center justify-between">
                                    <code className="text-2xl font-bold tracking-widest">{classDetails.inviteCode}</code>
                                    <Button variant="secondary" size="sm" className="h-8">Copy</Button>
                                </div>
                            </div>
                            <p className="text-xs opacity-80 text-center">
                                Students can use this code to join the class directly.
                            </p>
                            {isFull && (
                                <div className="flex items-center gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                                    <AlertCircle className="h-4 w-4" />
                                    <p className="text-xs font-bold">Class is at full capacity!</p>
                                </div>
                            )}
                            <Button size="lg" variant="secondary" className="w-full font-bold text-orange-600 hover:text-orange-700" disabled={isFull}>
                                Enroll Yourself
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">Class Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {classDetails.schedules && classDetails.schedules.length > 0 ? (
                                    classDetails.schedules.map((s, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 rounded-md bg-muted/50 text-sm">
                                            <span className="font-semibold">{s.day}</span>
                                            <span>{s.startTime} - {s.endTime}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-2 italic">No schedule set</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ShowView>
    )
}
export default Show
