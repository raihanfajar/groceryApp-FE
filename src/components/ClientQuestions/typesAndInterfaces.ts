import * as FaIcons from "react-icons/fa";

// !ClientQuestion
export interface Question {
    question: string;
    answer: string[];
}

export interface ClientQuestionType {
    topic: string;
    questions: Question[];
}

// !Topics
export interface Topic {
    title: string;
    icon: keyof typeof FaIcons;
    slug: string;
}