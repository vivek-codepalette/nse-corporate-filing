import { hashSync } from "bcrypt-ts"

export const seedData = {
    users: [
        {
            name: "Vivek Bezawada",
            email: "vivek@codepalette.ai",
            password: hashSync("password", 10),
            role: "admin",
        },
        {
            name: "John Doe",
            email: "john@doe.com",
            password: hashSync("password", 10),
            role: "user",
        },
    ],
}