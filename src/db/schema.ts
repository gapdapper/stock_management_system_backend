import { pgTable } from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";


export const users = pgTable("users", {
    id: t.integer(),
    username: t.varchar(),
    password: t.varchar(),
    firstName: t.varchar(),
    lastName: t.varchar(),
    createdAt: t.timestamp(),
})