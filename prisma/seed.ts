import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed no longer creates default tags; they are created when the user
 * chooses a profession during onboarding (or via Settings > Add default tags).
 * Seeds SQL Practice questions (idempotent by slug).
 */
async function main() {
  const questions = [
    {
      slug: "second-highest-salary",
      title: "Second Highest Salary",
      difficulty: "easy",
      order: 1,
      problemStatement: `Given a \`employees\` table with columns \`id\` and \`salary\`, write a SQL query to get the **second highest** salary. If there is no second highest salary, return \`NULL\`.

**Example:**

| id | salary |
|----|--------|
| 1  | 100    |
| 2  | 200    |
| 3  | 200    |

Expected result: one row with the second highest salary = \`100\` (or \`200\` if you interpret "second highest" as distinct—we expect \`100\` here: the second distinct salary when ordered descending). For this problem, return the salary that is strictly second when salaries are ordered descending (so 200, 200, 100 → second is 100).

**Schema (SQLite):** You have \`employees(id, salary)\`.`,
      schemaSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, salary INTEGER);`,
      seedSql: `INSERT INTO employees (id, salary) VALUES (1, 100), (2, 200), (3, 200);`,
      expectedResult: [{ salary: 100 }],
    },
    {
      slug: "department-highest-salary",
      title: "Department Highest Salary",
      difficulty: "medium",
      order: 2,
      problemStatement: `Given two tables:

- \`employee\`: \`id\`, \`name\`, \`salary\`, \`departmentId\`
- \`department\`: \`id\`, \`name\`

Write a query to find employees who have the **highest salary in each department**. Return \`department_name\`, \`employee_name\`, and \`salary\` (any column order is fine as long as the values match).

**Example:**

Employee:

| id | name  | salary | departmentId |
|----|-------|--------|--------------|
| 1  | Joe   | 70000  | 1            |
| 2  | Jim   | 90000  | 1            |
| 3  | Henry | 80000  | 2            |

Department:

| id | name   |
|----|--------|
| 1  | IT     |
| 2  | Sales  |

Expected: Jim (IT, 90000) and Henry (Sales, 80000).`,
      schemaSql: `CREATE TABLE department (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, departmentId INTEGER);`,
      seedSql: `INSERT INTO department (id, name) VALUES (1, 'IT'), (2, 'Sales');
INSERT INTO employee (id, name, salary, departmentId) VALUES (1, 'Joe', 70000, 1), (2, 'Jim', 90000, 1), (3, 'Henry', 80000, 2);`,
      expectedResult: [
        { department_name: "IT", employee_name: "Jim", salary: 90000 },
        { department_name: "Sales", employee_name: "Henry", salary: 80000 },
      ],
    },
    {
      slug: "duplicate-emails",
      title: "Find Duplicate Emails",
      difficulty: "easy",
      order: 3,
      problemStatement: `Given a table \`person\` with columns \`id\` and \`email\`, write a query to find all **duplicate** emails. Return each duplicate email once.

**Example:**

| id | email   |
|----|---------|
| 1  | a@b.com |
| 2  | c@d.com |
| 3  | a@b.com |

Expected: one row with \`email\` = \`a@b.com\`.`,
      schemaSql: `CREATE TABLE person (id INTEGER PRIMARY KEY, email TEXT);`,
      seedSql: `INSERT INTO person (id, email) VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');`,
      expectedResult: [{ email: "a@b.com" }],
    },
  ];

  for (const q of questions) {
    await prisma.sqlQuestion.upsert({
      where: { slug: q.slug },
      create: {
        slug: q.slug,
        title: q.title,
        difficulty: q.difficulty,
        order: q.order,
        problemStatement: q.problemStatement,
        schemaSql: q.schemaSql,
        seedSql: q.seedSql,
        expectedResult: q.expectedResult as object,
      },
      update: {
        title: q.title,
        difficulty: q.difficulty,
        order: q.order,
        problemStatement: q.problemStatement,
        schemaSql: q.schemaSql,
        seedSql: q.seedSql,
        expectedResult: q.expectedResult as object,
      },
    });
  }
  console.log("Seed complete. SQL Practice questions upserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
