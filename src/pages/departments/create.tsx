import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { useBack } from "@refinedev/core";
import { Loader2 } from "lucide-react";
import { departmentSchema } from "@/lib/schema";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";

const DepartmentsCreate = () => {
    const back = useBack();

    const form = useForm({
        resolver: zodResolver(departmentSchema),
        refineCoreProps: {
            resource: "departments",
            action: "create",
            redirect: "list",
        },
    });

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control,
    } = form;

    const onSubmit = async (values: z.infer<typeof departmentSchema>) => {
        try {
            await onFinish(values);
        } catch (error) {
            console.error("Error creating department:", error);
        }
    };

    return (
        <CreateView>
            <Breadcrumb />
            <h1 className="page-title">Create Department</h1>
            <div className="intro-row">
                <p>Add a new academic department to the system.</p>
                <Button variant="outline" onClick={() => back()}>Go Back</Button>
            </div>
            <Separator className="my-4" />
            <div className="flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">Department Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Computer Science" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Department Code</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. CS" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Optional description..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Department"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default DepartmentsCreate;
