import { Subject } from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        name: "Introduction to Computer Science",
        code: "CS101",
        department: "CS",
        description: "An introductory course on the fundamentals of computer science and programming.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        name: "Calculus I",
        code: "MATH101",
        department: "Math",
        description: "Differential and integral calculus of functions of one variable.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        name: "English Literature",
        code: "ENG101",
        department: "English",
        description: "A survey of major works and authors in English literature.",
        createdAt: new Date().toISOString(),
    },
];
