import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initDataBase() {
  return await open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
}

export default initDataBase();
