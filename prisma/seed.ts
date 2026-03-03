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
      problemStatement: `Write a SQL query to get the **second highest** salary. If there is no second highest salary, return \`NULL\`.

Return the salary that is strictly second when distinct salaries are ordered descending (e.g. 200, 200, 100 → second is **100**).

---

**Input:**

| employees | |
|---|---|
| id | INTEGER PRIMARY KEY |
| salary | INTEGER |`,
      schemaSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, salary INTEGER);`,
      seedSql: `INSERT INTO employees (id, salary) VALUES (1, 100), (2, 200), (3, 200);`,
      expectedResult: [{ salary: 100 }],
    },
    {
      slug: "department-highest-salary",
      title: "Department Highest Salary",
      difficulty: "medium",
      order: 2,
      problemStatement: `Write a query to find employees who have the **highest salary in each department**.

Return \`department_name\`, \`employee_name\`, and \`salary\`.

---

**Input:**

| employee | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| salary | INTEGER |
| departmentId | INTEGER |

| department | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |`,
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
      problemStatement: `Write a query to find all **duplicate** emails. Return each duplicate email once.

---

**Input:**

| person | |
|---|---|
| id | INTEGER PRIMARY KEY |
| email | TEXT |`,
      schemaSql: `CREATE TABLE person (id INTEGER PRIMARY KEY, email TEXT);`,
      seedSql: `INSERT INTO person (id, email) VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');`,
      expectedResult: [{ email: "a@b.com" }],
    },
    {
      slug: "customers-who-never-order",
      title: "Customers Who Never Order",
      difficulty: "easy",
      order: 4,
      problemStatement: `Find all customers who have never placed an order.

Return the customer \`name\`.

---

**Input:**

| customers | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |

| orders | |
|---|---|
| id | INTEGER PRIMARY KEY |
| customerId | INTEGER |`,
      schemaSql: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE orders (id INTEGER PRIMARY KEY, customerId INTEGER);`,
      seedSql: `INSERT INTO customers (id, name) VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');
INSERT INTO orders (id, customerId) VALUES (1, 3), (2, 1);`,
      expectedResult: [{ name: "Henry" }, { name: "Max" }],
    },
    {
      slug: "employees-earning-more-than-managers",
      title: "Employees Earning More Than Managers",
      difficulty: "easy",
      order: 5,
      problemStatement: `Find employees who earn more than their manager.

Return the employee \`name\`.

---

**Input:**

| employee | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| salary | INTEGER |
| managerId | INTEGER |`,
      schemaSql: `CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, managerId INTEGER);`,
      seedSql: `INSERT INTO employee (id, name, salary, managerId) VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);`,
      expectedResult: [{ name: "Joe" }],
    },
    {
      slug: "combine-two-tables",
      title: "Combine Two Tables",
      difficulty: "easy",
      order: 6,
      problemStatement: `Report the first name, last name, city, and state for each person. If a person's address is not in the \`address\` table, report \`NULL\` instead.

Return \`firstName\`, \`lastName\`, \`city\`, and \`state\`.

---

**Input:**

| person | |
|---|---|
| personId | INTEGER PRIMARY KEY |
| firstName | TEXT |
| lastName | TEXT |

| address | |
|---|---|
| addressId | INTEGER PRIMARY KEY |
| personId | INTEGER |
| city | TEXT |
| state | TEXT |`,
      schemaSql: `CREATE TABLE person (personId INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT);
CREATE TABLE address (addressId INTEGER PRIMARY KEY, personId INTEGER, city TEXT, state TEXT);`,
      seedSql: `INSERT INTO person (personId, firstName, lastName) VALUES (1, 'Allen', 'Wang'), (2, 'Bob', 'Alice');
INSERT INTO address (addressId, personId, city, state) VALUES (1, 2, 'New York', 'NY');`,
      expectedResult: [
        { firstName: "Allen", lastName: "Wang", city: null, state: null },
        { firstName: "Bob", lastName: "Alice", city: "New York", state: "NY" },
      ],
    },
    {
      slug: "classes-with-five-students",
      title: "Classes With Five or More Students",
      difficulty: "easy",
      order: 7,
      problemStatement: `Find all classes that have **at least five students**.

Return the \`class\` name.

---

**Input:**

| courses | |
|---|---|
| student | TEXT |
| class | TEXT |`,
      schemaSql: `CREATE TABLE courses (student TEXT, class TEXT);`,
      seedSql: `INSERT INTO courses (student, class) VALUES ('A', 'Math'), ('B', 'English'), ('C', 'Math'), ('D', 'Biology'), ('E', 'Math'), ('F', 'Math'), ('G', 'Math'), ('H', 'English'), ('I', 'Biology'), ('J', 'English'), ('K', 'English'), ('L', 'English');`,
      expectedResult: [{ class: "Math" }, { class: "English" }],
    },
    {
      slug: "rising-temperature",
      title: "Rising Temperature",
      difficulty: "medium",
      order: 8,
      problemStatement: `Find the \`id\` of days where the temperature was **higher than the previous day**.

---

**Input:**

| weather | |
|---|---|
| id | INTEGER PRIMARY KEY |
| recordDate | TEXT |
| temperature | INTEGER |`,
      schemaSql: `CREATE TABLE weather (id INTEGER PRIMARY KEY, recordDate TEXT, temperature INTEGER);`,
      seedSql: `INSERT INTO weather (id, recordDate, temperature) VALUES (1, '2023-01-01', 10), (2, '2023-01-02', 25), (3, '2023-01-03', 20), (4, '2023-01-04', 30);`,
      expectedResult: [{ id: 2 }, { id: 4 }],
    },
    {
      slug: "consecutive-numbers",
      title: "Consecutive Numbers",
      difficulty: "medium",
      order: 9,
      problemStatement: `Find all numbers that appear **at least three times consecutively** in the \`logs\` table.

Return the \`num\` (each value once).

---

**Input:**

| logs | |
|---|---|
| id | INTEGER PRIMARY KEY |
| num | INTEGER |`,
      schemaSql: `CREATE TABLE logs (id INTEGER PRIMARY KEY, num INTEGER);`,
      seedSql: `INSERT INTO logs (id, num) VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);`,
      expectedResult: [{ num: 1 }],
    },
    {
      slug: "rank-scores",
      title: "Rank Scores",
      difficulty: "medium",
      order: 10,
      problemStatement: `Rank scores from highest to lowest using **dense ranking** — equal scores share the same rank, and the next rank is the next consecutive integer.

Return \`score\` and \`rank\`, ordered by score descending.

---

**Input:**

| scores | |
|---|---|
| id | INTEGER PRIMARY KEY |
| score | INTEGER |`,
      schemaSql: `CREATE TABLE scores (id INTEGER PRIMARY KEY, score INTEGER);`,
      seedSql: `INSERT INTO scores (id, score) VALUES (1, 350), (2, 365), (3, 400), (4, 385), (5, 400), (6, 365);`,
      expectedResult: [
        { score: 400, rank: 1 },
        { score: 400, rank: 1 },
        { score: 385, rank: 2 },
        { score: 365, rank: 3 },
        { score: 365, rank: 3 },
        { score: 350, rank: 4 },
      ],
    },
    {
      slug: "department-top-three-salaries",
      title: "Department Top Three Salaries",
      difficulty: "hard",
      order: 11,
      problemStatement: `Find employees who earn one of the **top three unique salaries** in their department.

Return \`department_name\`, \`employee_name\`, and \`salary\`.

---

**Input:**

| employee | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| salary | INTEGER |
| departmentId | INTEGER |

| department | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |`,
      schemaSql: `CREATE TABLE department (id INTEGER PRIMARY KEY, name TEXT);
CREATE TABLE employee (id INTEGER PRIMARY KEY, name TEXT, salary INTEGER, departmentId INTEGER);`,
      seedSql: `INSERT INTO department (id, name) VALUES (1, 'IT'), (2, 'Sales');
INSERT INTO employee (id, name, salary, departmentId) VALUES (1, 'Joe', 85000, 1), (2, 'Henry', 80000, 2), (3, 'Sam', 60000, 2), (4, 'Max', 90000, 1), (5, 'Janet', 69000, 1), (6, 'Randy', 85000, 1), (7, 'Will', 70000, 1);`,
      expectedResult: [
        { department_name: "IT", employee_name: "Max", salary: 90000 },
        { department_name: "IT", employee_name: "Joe", salary: 85000 },
        { department_name: "IT", employee_name: "Randy", salary: 85000 },
        { department_name: "IT", employee_name: "Will", salary: 70000 },
        { department_name: "Sales", employee_name: "Henry", salary: 80000 },
        { department_name: "Sales", employee_name: "Sam", salary: 60000 },
      ],
    },

    // ── Window Functions ──────────────────────────────────────────────

    {
      slug: "running-total-of-sales",
      title: "Running Total of Sales",
      difficulty: "medium",
      order: 12,
      problemStatement: `Calculate the **running total** of sales amount ordered by \`sale_date\`.

Return \`sale_date\`, \`amount\`, and \`running_total\`.

---

**Input:**

| sales | |
|---|---|
| id | INTEGER PRIMARY KEY |
| sale_date | TEXT |
| amount | INTEGER |`,
      schemaSql: `CREATE TABLE sales (id INTEGER PRIMARY KEY, sale_date TEXT, amount INTEGER);`,
      seedSql: `INSERT INTO sales (id, sale_date, amount) VALUES (1, '2024-01-01', 100), (2, '2024-01-02', 200), (3, '2024-01-03', 150), (4, '2024-01-04', 300);`,
      expectedResult: [
        { sale_date: "2024-01-01", amount: 100, running_total: 100 },
        { sale_date: "2024-01-02", amount: 200, running_total: 300 },
        { sale_date: "2024-01-03", amount: 150, running_total: 450 },
        { sale_date: "2024-01-04", amount: 300, running_total: 750 },
      ],
    },
    {
      slug: "month-over-month-growth",
      title: "Month-over-Month Revenue Change",
      difficulty: "medium",
      order: 13,
      problemStatement: `For each month, calculate the revenue and the **difference from the previous month**. Use \`LAG\` to find the prior month's revenue.

Return \`month\`, \`revenue\`, and \`revenue_change\` (current minus previous; \`NULL\` for the first month).

---

**Input:**

| monthly_revenue | |
|---|---|
| month | TEXT |
| revenue | INTEGER |`,
      schemaSql: `CREATE TABLE monthly_revenue (month TEXT PRIMARY KEY, revenue INTEGER);`,
      seedSql: `INSERT INTO monthly_revenue (month, revenue) VALUES ('2024-01', 5000), ('2024-02', 7000), ('2024-03', 6500), ('2024-04', 8000);`,
      expectedResult: [
        { month: "2024-01", revenue: 5000, revenue_change: null },
        { month: "2024-02", revenue: 7000, revenue_change: 2000 },
        { month: "2024-03", revenue: 6500, revenue_change: -500 },
        { month: "2024-04", revenue: 8000, revenue_change: 1500 },
      ],
    },
    {
      slug: "top-n-per-group",
      title: "Top 2 Products per Category",
      difficulty: "hard",
      order: 14,
      problemStatement: `Find the **top 2 highest-priced products** in each category. If there is a tie, include all tied products.

Return \`category\`, \`product\`, and \`price\`, ordered by category then price descending.

---

**Input:**

| products | |
|---|---|
| id | INTEGER PRIMARY KEY |
| category | TEXT |
| product | TEXT |
| price | INTEGER |`,
      schemaSql: `CREATE TABLE products (id INTEGER PRIMARY KEY, category TEXT, product TEXT, price INTEGER);`,
      seedSql: `INSERT INTO products (id, category, product, price) VALUES (1, 'Electronics', 'Laptop', 1200), (2, 'Electronics', 'Phone', 800), (3, 'Electronics', 'Tablet', 600), (4, 'Clothing', 'Jacket', 150), (5, 'Clothing', 'Shirt', 50), (6, 'Clothing', 'Pants', 80);`,
      expectedResult: [
        { category: "Clothing", product: "Jacket", price: 150 },
        { category: "Clothing", product: "Pants", price: 80 },
        { category: "Electronics", product: "Laptop", price: 1200 },
        { category: "Electronics", product: "Phone", price: 800 },
      ],
    },

    // ── CTEs & Recursive Queries ──────────────────────────────────────

    {
      slug: "fibonacci-sequence",
      title: "Fibonacci Sequence",
      difficulty: "hard",
      order: 15,
      problemStatement: `Generate the first **8 numbers** of the Fibonacci sequence using a **recursive CTE**.

Return \`n\` (position, starting at 1) and \`fib\` (the Fibonacci value).

---

*No input tables — generate the sequence purely with SQL.*`,
      schemaSql: `CREATE TABLE _placeholder (x INTEGER);`,
      seedSql: `INSERT INTO _placeholder VALUES (0);`,
      expectedResult: [
        { n: 1, fib: 0 },
        { n: 2, fib: 1 },
        { n: 3, fib: 1 },
        { n: 4, fib: 2 },
        { n: 5, fib: 3 },
        { n: 6, fib: 5 },
        { n: 7, fib: 8 },
        { n: 8, fib: 13 },
      ],
    },
    {
      slug: "employee-hierarchy-depth",
      title: "Employee Hierarchy Depth",
      difficulty: "hard",
      order: 16,
      problemStatement: `Using a **recursive CTE**, determine each employee's **depth** in the org chart. The CEO (no manager) has depth 1, their direct reports have depth 2, and so on.

Return \`name\` and \`depth\`.

---

**Input:**

| employees | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| managerId | INTEGER |`,
      schemaSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, managerId INTEGER);`,
      seedSql: `INSERT INTO employees (id, name, managerId) VALUES (1, 'Alice', NULL), (2, 'Bob', 1), (3, 'Carol', 1), (4, 'Dave', 2), (5, 'Eve', 2), (6, 'Frank', 3);`,
      expectedResult: [
        { name: "Alice", depth: 1 },
        { name: "Bob", depth: 2 },
        { name: "Carol", depth: 2 },
        { name: "Dave", depth: 3 },
        { name: "Eve", depth: 3 },
        { name: "Frank", depth: 3 },
      ],
    },

    // ── Pivoting / Conditional Aggregation ────────────────────────────

    {
      slug: "pivot-sales-by-quarter",
      title: "Pivot Sales by Quarter",
      difficulty: "medium",
      order: 17,
      problemStatement: `Pivot the sales data so each row shows a product and its **total sales per quarter** as separate columns.

Return \`product\`, \`q1\`, \`q2\`, \`q3\`, and \`q4\`. Use \`0\` if a product has no sales in a quarter.

---

**Input:**

| sales | |
|---|---|
| id | INTEGER PRIMARY KEY |
| product | TEXT |
| quarter | INTEGER |
| amount | INTEGER |`,
      schemaSql: `CREATE TABLE sales (id INTEGER PRIMARY KEY, product TEXT, quarter INTEGER, amount INTEGER);`,
      seedSql: `INSERT INTO sales (id, product, quarter, amount) VALUES (1, 'Widget', 1, 100), (2, 'Widget', 2, 200), (3, 'Widget', 4, 150), (4, 'Gadget', 1, 300), (5, 'Gadget', 3, 250), (6, 'Gadget', 4, 400);`,
      expectedResult: [
        { product: "Gadget", q1: 300, q2: 0, q3: 250, q4: 400 },
        { product: "Widget", q1: 100, q2: 200, q3: 0, q4: 150 },
      ],
    },
    {
      slug: "pass-fail-counts",
      title: "Pass / Fail Counts per Subject",
      difficulty: "easy",
      order: 18,
      problemStatement: `Count the number of students who **passed** and **failed** each subject. A score of **60 or above** is a pass.

Return \`subject\`, \`passed\`, and \`failed\`.

---

**Input:**

| exam_results | |
|---|---|
| id | INTEGER PRIMARY KEY |
| student | TEXT |
| subject | TEXT |
| score | INTEGER |`,
      schemaSql: `CREATE TABLE exam_results (id INTEGER PRIMARY KEY, student TEXT, subject TEXT, score INTEGER);`,
      seedSql: `INSERT INTO exam_results (id, student, subject, score) VALUES (1, 'Alice', 'Math', 85), (2, 'Bob', 'Math', 55), (3, 'Carol', 'Math', 72), (4, 'Alice', 'Science', 45), (5, 'Bob', 'Science', 90), (6, 'Carol', 'Science', 60);`,
      expectedResult: [
        { subject: "Math", passed: 2, failed: 1 },
        { subject: "Science", passed: 2, failed: 1 },
      ],
    },

    // ── Date / Time Operations ────────────────────────────────────────

    {
      slug: "active-users-per-day",
      title: "Users Active on Consecutive Days",
      difficulty: "hard",
      order: 19,
      problemStatement: `Find users who were active on **at least 3 consecutive days**.

Return each qualifying \`user_id\` once.

---

**Input:**

| logins | |
|---|---|
| id | INTEGER PRIMARY KEY |
| user_id | INTEGER |
| login_date | TEXT |`,
      schemaSql: `CREATE TABLE logins (id INTEGER PRIMARY KEY, user_id INTEGER, login_date TEXT);`,
      seedSql: `INSERT INTO logins (id, user_id, login_date) VALUES (1, 1, '2024-03-01'), (2, 1, '2024-03-02'), (3, 1, '2024-03-03'), (4, 2, '2024-03-01'), (5, 2, '2024-03-03'), (6, 3, '2024-03-10'), (7, 3, '2024-03-11'), (8, 3, '2024-03-12'), (9, 3, '2024-03-13');`,
      expectedResult: [{ user_id: 1 }, { user_id: 3 }],
    },
    {
      slug: "days-between-orders",
      title: "Average Days Between Orders",
      difficulty: "medium",
      order: 20,
      problemStatement: `For each customer, calculate the **average number of days between consecutive orders**. Only include customers with 2 or more orders.

Return \`customer_id\` and \`avg_days\` (rounded to the nearest integer).

---

**Input:**

| orders | |
|---|---|
| id | INTEGER PRIMARY KEY |
| customer_id | INTEGER |
| order_date | TEXT |`,
      schemaSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT);`,
      seedSql: `INSERT INTO orders (id, customer_id, order_date) VALUES (1, 1, '2024-01-01'), (2, 1, '2024-01-11'), (3, 1, '2024-01-21'), (4, 2, '2024-02-01'), (5, 2, '2024-02-15'), (6, 3, '2024-03-01');`,
      expectedResult: [
        { customer_id: 1, avg_days: 10 },
        { customer_id: 2, avg_days: 14 },
      ],
    },

    // ── String Manipulation ───────────────────────────────────────────

    {
      slug: "fix-name-casing",
      title: "Fix Name Casing",
      difficulty: "easy",
      order: 21,
      problemStatement: `Names were entered with inconsistent casing. Fix each name so the **first letter is uppercase** and the **rest are lowercase**.

Return the corrected \`name\`, ordered alphabetically.

---

**Input:**

| users | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |`,
      schemaSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);`,
      seedSql: `INSERT INTO users (id, name) VALUES (1, 'aLICE'), (2, 'bOB'), (3, 'CAROL'), (4, 'dave');`,
      expectedResult: [
        { name: "Alice" },
        { name: "Bob" },
        { name: "Carol" },
        { name: "Dave" },
      ],
    },
    {
      slug: "extract-email-domain",
      title: "Extract Email Domain",
      difficulty: "easy",
      order: 22,
      problemStatement: `Count the number of users registered with each **email domain** (the part after the \`@\`).

Return \`domain\` and \`count\`, ordered by count descending.

---

**Input:**

| users | |
|---|---|
| id | INTEGER PRIMARY KEY |
| email | TEXT |`,
      schemaSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, email TEXT);`,
      seedSql: `INSERT INTO users (id, email) VALUES (1, 'alice@gmail.com'), (2, 'bob@yahoo.com'), (3, 'carol@gmail.com'), (4, 'dave@gmail.com'), (5, 'eve@yahoo.com');`,
      expectedResult: [
        { domain: "gmail.com", count: 3 },
        { domain: "yahoo.com", count: 2 },
      ],
    },

    // ── Set Operations ────────────────────────────────────────────────

    {
      slug: "students-in-both-courses",
      title: "Students Enrolled in Both Courses",
      difficulty: "easy",
      order: 23,
      problemStatement: `Find students who are enrolled in **both** \`'Math'\` and \`'Science'\`.

Return the student \`name\`.

---

**Input:**

| enrollments | |
|---|---|
| id | INTEGER PRIMARY KEY |
| name | TEXT |
| course | TEXT |`,
      schemaSql: `CREATE TABLE enrollments (id INTEGER PRIMARY KEY, name TEXT, course TEXT);`,
      seedSql: `INSERT INTO enrollments (id, name, course) VALUES (1, 'Alice', 'Math'), (2, 'Alice', 'Science'), (3, 'Bob', 'Math'), (4, 'Carol', 'Science'), (5, 'Dave', 'Math'), (6, 'Dave', 'Science'), (7, 'Dave', 'History');`,
      expectedResult: [{ name: "Alice" }, { name: "Dave" }],
    },
    {
      slug: "new-customers-this-month",
      title: "New vs Returning Customers",
      difficulty: "medium",
      order: 24,
      problemStatement: `Classify each March 2024 order as coming from a **new** customer (no orders before March 2024) or a **returning** customer.

Return \`customer_type\` (\`'new'\` or \`'returning'\`) and the \`count\` of distinct customers.

---

**Input:**

| orders | |
|---|---|
| id | INTEGER PRIMARY KEY |
| customer_id | INTEGER |
| order_date | TEXT |`,
      schemaSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, order_date TEXT);`,
      seedSql: `INSERT INTO orders (id, customer_id, order_date) VALUES (1, 1, '2024-01-15'), (2, 2, '2024-02-10'), (3, 1, '2024-03-05'), (4, 3, '2024-03-12'), (5, 4, '2024-03-20'), (6, 2, '2024-03-25');`,
      expectedResult: [
        { customer_type: "new", count: 2 },
        { customer_type: "returning", count: 2 },
      ],
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
