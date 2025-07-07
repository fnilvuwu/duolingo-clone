// seed_batak_data.ts

import { neon } from "@neondatabase/serverless";
import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding Batak database...");

        // Delete all data
        await Promise.all([
            db.delete(schema.challengeProgress),
            db.delete(schema.challengeOptions),
            db.delete(schema.challenges),
            db.delete(schema.lessons),
            db.delete(schema.units),
            db.delete(schema.courses),
            db.delete(schema.words),
            db.delete(schema.matchingPairs),
            db.delete(schema.userProgress),
        ]);

        // Insert course
        const [batakCourse] = await db
            .insert(schema.courses)
            .values([{ title: "Batak", imageSrc: "/batak.svg" }])
            .returning();

        // Insert unit
        const [unit] = await db
            .insert(schema.units)
            .values({
                courseId: batakCourse.id,
                title: "Unit 1",
                description: "Belajar dasar bahasa Batak",
                order: 1,
            })
            .returning();

        // Insert lesson
        const [lesson] = await db
            .insert(schema.lessons)
            .values({
                unitId: unit.id,
                title: "Pengenalan Kata",
                order: 1,
            })
            .returning();

        // Insert words
        await db
            .insert(schema.words)
            .values([
                {
                    batak: "ᯇ",
                    latin: "i",
                    indonesia: "ibu",
                    type: "noun",
                    tags: "keluarga",
                },
                {
                    batak: "ᯉᯰᯰ",
                    latin: "nang",
                    indonesia: "ibu",
                    type: "noun",
                    tags: "keluarga",
                },
                {
                    batak: "ᯎ",
                    latin: "a",
                    indonesia: "nama",
                    type: "noun",
                    tags: "identitas",
                },
                {
                    batak: "ᯒ",
                    latin: "ru",
                    indonesia: "nama",
                    type: "noun",
                    tags: "identitas",
                },
                {
                    batak: "ᯀ",
                    latin: "na",
                    indonesia: "dia",
                    type: "pronoun",
                    tags: "pronomina",
                },
            ])
            .returning();

        // Insert VOCAB_INTRO challenge
        await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "VOCAB_INTRO",
                question: "Pelajari kata 'ibu' dalam aksara Batak",
                order: 1,
            })
            .returning();

        // Insert SELECT challenge
        const [selectChallenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "SELECT",
                question: "Yang mana terjemahan dari 'ibu'?",
                order: 2,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: selectChallenge.id,
                text: "ᯇᯉᯰᯰ",
                correct: true,
            },
            {
                challengeId: selectChallenge.id,
                text: "ᯎᯒ",
                correct: false,
            },
            {
                challengeId: selectChallenge.id,
                text: "ᯀ",
                correct: false,
            },
            {
                challengeId: selectChallenge.id,
                text: "ᯉᯰ",
                correct: false,
            },
        ]);

        // Insert FILL_BLANK challenge
        const [fillChallenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "FILL_BLANK",
                question: "______ berarti ibu dalam bahasa Batak",
                order: 3,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: fillChallenge.id,
                text: "ᯇᯉᯰᯰ",
                correct: true,
            },
            {
                challengeId: fillChallenge.id,
                text: "ᯒ",
                correct: false,
            },
            {
                challengeId: fillChallenge.id,
                text: "ᯎᯀ",
                correct: false,
            },
            {
                challengeId: fillChallenge.id,
                text: "ᯀ",
                correct: false,
            },
        ]);

        // Insert MATCHING challenge
        const [matchChallenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "MATCHING",
                question: "Pasangkan kata Batak dengan terjemahan Indonesianya:",
                order: 4,
            })
            .returning();

        await db.insert(schema.matchingPairs).values([
            {
                challengeId: matchChallenge.id,
                batak: "ᯇᯉᯰᯰ",
                indonesia: "ibu",
            },
            {
                challengeId: matchChallenge.id,
                batak: "ᯎᯒ",
                indonesia: "nama",
            },
            {
                challengeId: matchChallenge.id,
                batak: "ᯀ",
                indonesia: "dia",
            },
        ]);

        // Insert ASSIST challenge
        const [assistChallenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "ASSIST",
                question: "Tulis kata 'ibu' dalam aksara Batak",
                order: 5,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: assistChallenge.id,
                text: "ᯇ",
                correct: true,
            },
            {
                challengeId: assistChallenge.id,
                text: "ᯉᯰᯰ",
                correct: true,
            },
            {
                challengeId: assistChallenge.id,
                text: "ᯎ",
                correct: false,
            },
            {
                challengeId: assistChallenge.id,
                text: "ᯒ",
                correct: false,
            },
            {
                challengeId: assistChallenge.id,
                text: "ᯀ",
                correct: false,
            },
        ]);

        // Insert ARRANGE challenge
        const [arrangeChallenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson.id,
                type: "ARRANGE",
                question: "Susun kata-kata berikut untuk membentuk kalimat yang benar: 'Nama dia ibu'",
                order: 6,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: arrangeChallenge.id,
                text: "ᯎᯒ",
                correct: true,
            },
            {
                challengeId: arrangeChallenge.id,
                text: "ᯀ",
                correct: true,
            },
            {
                challengeId: arrangeChallenge.id,
                text: "ᯇᯉᯰᯰ",
                correct: true,
            },
            {
                challengeId: arrangeChallenge.id,
                text: "ᯎ",
                correct: false,
            },
        ]);

        // Insert additional words for more variety
        await db
            .insert(schema.words)
            .values([
                {
                    batak: "ᯅᯩ",
                    latin: "boi",
                    indonesia: "anak laki-laki",
                    type: "noun",
                    tags: "keluarga",
                },
                {
                    batak: "ᯅᯅᯩ",
                    latin: "boru",
                    indonesia: "anak perempuan",
                    type: "noun",
                    tags: "keluarga",
                },
                {
                    batak: "ᯀᯔ",
                    latin: "au",
                    indonesia: "saya",
                    type: "pronoun",
                    tags: "pronomina",
                },
                {
                    batak: "ᯍᯭ",
                    latin: "ho",
                    indonesia: "kamu",
                    type: "pronoun",
                    tags: "pronomina",
                },
                {
                    batak: "ᯇᯒ",
                    latin: "ama",
                    indonesia: "ayah",
                    type: "noun",
                    tags: "keluarga",
                },
            ])
            .returning();

        // Create second lesson for more challenges
        const [lesson2] = await db
            .insert(schema.lessons)
            .values({
                unitId: unit.id,
                title: "Keluarga",
                order: 2,
            })
            .returning();

        // INSERT VOCAB_INTRO for lesson 2
        await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "VOCAB_INTRO",
                question: "Pelajari kata 'ayah' dalam aksara Batak",
                order: 1,
            })
            .returning();

        // INSERT SELECT challenge for lesson 2
        const [select2Challenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "SELECT",
                question: "Pilih terjemahan yang tepat untuk 'ᯇᯒ'",
                order: 2,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: select2Challenge.id,
                text: "ayah",
                correct: true,
            },
            {
                challengeId: select2Challenge.id,
                text: "ibu",
                correct: false,
            },
            {
                challengeId: select2Challenge.id,
                text: "anak",
                correct: false,
            },
            {
                challengeId: select2Challenge.id,
                text: "nama",
                correct: false,
            },
        ]);

        // INSERT FILL_BLANK for lesson 2
        const [fill2Challenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "FILL_BLANK",
                question: "______ adalah cara mengatakan 'saya' dalam aksara Batak",
                order: 3,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: fill2Challenge.id,
                text: "ᯀᯔ",
                correct: true,
            },
            {
                challengeId: fill2Challenge.id,
                text: "ᯍᯭ",
                correct: false,
            },
            {
                challengeId: fill2Challenge.id,
                text: "ᯀ",
                correct: false,
            },
            {
                challengeId: fill2Challenge.id,
                text: "ᯇᯒ",
                correct: false,
            },
        ]);

        // INSERT MATCHING for lesson 2
        const [match2Challenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "MATCHING",
                question: "Pasangkan kata ganti dengan terjemahannya:",
                order: 4,
            })
            .returning();

        await db.insert(schema.matchingPairs).values([
            {
                challengeId: match2Challenge.id,
                batak: "ᯀᯔ",
                indonesia: "saya",
            },
            {
                challengeId: match2Challenge.id,
                batak: "ᯍᯭ",
                indonesia: "kamu",
            },
            {
                challengeId: match2Challenge.id,
                batak: "ᯀ",
                indonesia: "dia",
            },
        ]);

        // INSERT ASSIST for lesson 2
        const [assist2Challenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "ASSIST",
                question: "Tulis kata 'ayah' dalam aksara Batak",
                order: 5,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: assist2Challenge.id,
                text: "ᯇ",
                correct: true,
            },
            {
                challengeId: assist2Challenge.id,
                text: "ᯒ",
                correct: true,
            },
            {
                challengeId: assist2Challenge.id,
                text: "ᯉᯰᯰ",
                correct: false,
            },
            {
                challengeId: assist2Challenge.id,
                text: "ᯎ",
                correct: false,
            },
            {
                challengeId: assist2Challenge.id,
                text: "ᯀ",
                correct: false,
            },
        ]);

        // INSERT ARRANGE for lesson 2
        const [arrange2Challenge] = await db
            .insert(schema.challenges)
            .values({
                lessonId: lesson2.id,
                type: "ARRANGE",
                question: "Susun kata-kata untuk membentuk: 'Saya anak laki-laki'",
                order: 6,
            })
            .returning();

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: arrange2Challenge.id,
                text: "ᯀᯔ",
                correct: true,
            },
            {
                challengeId: arrange2Challenge.id,
                text: "ᯅᯩ",
                correct: true,
            },
            {
                challengeId: arrange2Challenge.id,
                text: "ᯇᯒ",
                correct: false,
            },
            {
                challengeId: arrange2Challenge.id,
                text: "ᯍᯭ",
                correct: false,
            },
        ]);

        console.log("✅ Batak database seeded successfully with all challenge types!");
    } catch (err) {
        console.error("❌ Failed to seed Batak database:", err);
        throw err;
    }
};

void main();
