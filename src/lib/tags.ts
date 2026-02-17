import { prisma } from "./db";

const FIXED_TAGS = [
  { name: "SQL", slug: "sql" },
  { name: "ML", slug: "ml" },
  { name: "Stats", slug: "stats" },
  { name: "Python", slug: "python" },
  { name: "Behavioral", slug: "behavioral" },
];

export async function ensureFixedTags() {
  for (const tag of FIXED_TAGS) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: { ...tag, isSystem: true },
    });
  }
}

export async function getAllTags() {
  await ensureFixedTags();
  return prisma.tag.findMany({ orderBy: [{ isSystem: "desc" }, { name: "asc" }] });
}

export async function createTag(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  if (!slug) throw new Error("Invalid tag name");
  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) throw new Error("Tag already exists");
  return prisma.tag.create({ data: { name, slug, isSystem: false } });
}

export async function deleteTag(id: string) {
  const tag = await prisma.tag.findUnique({ where: { id } });
  if (!tag) throw new Error("Tag not found");
  if (tag.isSystem) throw new Error("Cannot delete system tag");
  await prisma.taskTag.deleteMany({ where: { tagId: id } });
  return prisma.tag.delete({ where: { id } });
}
