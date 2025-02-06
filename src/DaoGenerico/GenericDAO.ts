import { Database } from "sqlite";

export type Criteria = {
    field: string;
    op: '=' | '!=' | '>' | '<' | '>=' | '<=';
    value: any;
};

export class GenericDAO<T> {
    private db: Database;
    private tableName: string;

    constructor(db: Database, tableName: string) {
        this.db = db;
        this.tableName = tableName;
    }

    async create(entity: T): Promise<void> {
        const keys = Object.keys(entity).join(', ');
        const values = Object.values(entity).map(() => '?').join(', ');
        await this.db.run(`INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`, Object.values(entity));
    }

    async read(id: number): Promise<T | null> {
        return this.db.get(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    async update(id: number, entity: T): Promise<void> {
        const updates = Object.keys(entity).map(key => `${key} = ?`).join(', ');
        await this.db.run(`UPDATE ${this.tableName} SET ${updates} WHERE id = ?`, [...Object.values(entity), id]);
    }

    async delete(id: number): Promise<void> {
        await this.db.run(`DELETE FROM ${this.tableName} WHERE id = ?`, [id]);
    }

    async findAll(): Promise<T[]> {
        return this.db.all(`SELECT * FROM ${this.tableName}`);
    }

    async findByCriteria(criteria: Criteria): Promise<T[]> {
        const { field, op, value } = criteria;
        return this.db.all(`SELECT * FROM ${this.tableName} WHERE ${field} ${op} ?`, [value]);
    }
}