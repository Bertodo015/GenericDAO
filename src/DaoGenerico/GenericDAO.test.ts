import { Database } from "sqlite";
import { GenericDAO, Criteria } from "./GenericDAO";

describe("Tests over GenericDAO", () => {
  let db: Database;
  let dao: GenericDAO<any>;

  beforeAll(async () => {
    db = new Database();
    dao = new GenericDAO(db, "test_table");
    await db.exec(`CREATE TABLE IF NOT EXISTS test_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      value INTEGER NOT NULL
    )`);
  });

  afterAll(async () => {
    await db.close();
  });

  it("should insert a record correctly", async () => {
    await dao.create({ name: "Test Item", value: 42 });
    const rows = await dao.findAll();
    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0].name).toBe("Test Item");
    expect(rows[0].value).toBe(42);
  });

  it("should read a record by ID", async () => {
    const record = await dao.read(1);
    expect(record).not.toBeNull();
    expect(record?.name).toBe("Test Item");
  });

  it("should update a record correctly", async () => {
    await dao.update(1, { name: "Updated Item", value: 100 });
    const record = await dao.read(1);
    expect(record?.name).toBe("Updated Item");
    expect(record?.value).toBe(100);
  });

  it("should delete a record correctly", async () => {
    await dao.delete(1);
    const record = await dao.read(1);
    expect(record).toBeNull();
  });

  it("should find records by criteria", async () => {
    await dao.create({ name: "Item A", value: 10 });
    await dao.create({ name: "Item B", value: 20 });
    const criteria: Criteria = { field: "value", op: ">", value: 15 };
    const results = await dao.findByCriteria(criteria);
    expect(results.length).toBe(1);
    expect(results[0].name).toBe("Item B");
  });
});