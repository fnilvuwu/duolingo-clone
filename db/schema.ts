// ✅ FULL SCHEMA: Extended to support new question types without removing existing features

import { relations } from "drizzle-orm";
import {
    boolean,
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
} from "drizzle-orm/pg-core";

import { MAX_HEARTS } from "@/constants";

// --- Existing Tables ---

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    courseId: integer("course_id")
        .references(() => courses.id, { onDelete: "cascade" })
        .notNull(),
    order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id")
        .references(() => units.id, { onDelete: "cascade" })
        .notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengesEnum = pgEnum("type", [
    "SELECT",
    "ASSIST",
    "FILL_BLANK",
    "MATCHING",
    "ARRANGE",
    "VOCAB_INTRO"
]);

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonId: integer("lesson_id")
        .references(() => lessons.id, { onDelete: "cascade" })
        .notNull(),
    type: challengesEnum("type").notNull(),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonId],
        references: [lessons.id],
    }),
    challengeOptions: many(challengeOptions),
    challengeProgress: many(challengeProgress),
    matchingPairs: many(matchingPairs),
}));

export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, { onDelete: "cascade" })
        .notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(
    challengeOptions,
    ({ one }) => ({
        challenge: one(challenges, {
            fields: [challengeOptions.challengeId],
            references: [challenges.id],
        }),
    })
);

export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, { onDelete: "cascade" })
        .notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(
    challengeProgress,
    ({ one }) => ({
        challenge: one(challenges, {
            fields: [challengeProgress.challengeId],
            references: [challenges.id],
        }),
    })
);

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/mascot.svg"),
    activeCourseId: integer("active_course_id")
        .references(() => courses.id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(MAX_HEARTS),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));

export const userSubscription = pgTable("user_subscription", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

// --- New Tables for Word Bank & Matching ---

export const words = pgTable("words", {
    id: serial("id").primaryKey(),
    batak: text("batak").notNull(),
    latin: text("latin").notNull(),
    indonesia: text("indonesia").notNull(),
    type: text("type"),
    tags: text("tags"),
    imageUrl: text("image_url"),
    audioUrl: text("audio_url"),
});

export const phrases = pgTable("phrases", {
    id: serial("id").primaryKey(),
    batak: text("batak").notNull(),
    latin: text("latin").notNull(),
    indonesia: text("indonesia").notNull(),
    componentWordIds: text("component_word_ids"),
});

export const matchingPairs = pgTable("matching_pairs", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id")
        .references(() => challenges.id, { onDelete: "cascade" })
        .notNull(),
    batak: text("batak"),
    indonesia: text("indonesia"),
    imageSrc: text("image_src"),
});

export const matchingPairsRelations = relations(matchingPairs, ({ one }) => ({
    challenge: one(challenges, {
        fields: [matchingPairs.challengeId],
        references: [challenges.id],
    }),
}));

export const stopWords = pgTable("stop_words", {
    id: serial("id").primaryKey(),
    word: text("word").notNull(),
    language: text("language").notNull(),
});