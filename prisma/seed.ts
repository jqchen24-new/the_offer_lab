import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FIXED_TAGS = [
  { name: "SQL", slug: "sql", isSystem: true },
  { name: "ML", slug: "ml", isSystem: true },
  { name: "Stats", slug: "stats", isSystem: true },
  { name: "Python", slug: "python", isSystem: true },
  { name: "Behavioral", slug: "behavioral", isSystem: true },
];

async function main() {
  for (const tag of FIXED_TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log("Seeded 5 fixed tags.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
