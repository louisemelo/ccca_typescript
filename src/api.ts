import crypto from "crypto";
import express from "express";
import pgp from "pg-promise";
import { validate } from "./validateCPF";
const app = express();
app.use(express.json());

app.post("/signup", async function (req, res) {
	let result;
	const connection = pgp()("postgres://postgres:admin@localhost:5432/app");
	try {
		const id = crypto.randomUUID();
		const [acc] = await connection.query("select * from cccat16.account where email = $1", [req.body.email]);
		if (!acc) result = -4;
        if (!req.body.name.match(/[a-zA-Z] [a-zA-Z]+/)) result = -3;
        if (!req.body.email.match(/^(.+)@(.+)$/)) return -2;
        if (!validate(req.body.cpf)) return -1;
        if (req.body.isDriver && req.body.carPlate.match(/[A-Z]{3}[0-9]{4}/)) return -5;						
        await connection.query("insert into cccat16.account (account_id, name, email, cpf, car_plate, is_Passenger, is_Driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, req.body.name, req.body.email, req.body.cpf, req.body.carPlate, !!req.body.isPassenger, !!req.body.isDriver]);
        const obj = {
            accountId: id
        };
        result = obj;
		if (typeof result === "number") {
			res.status(422).send(result + "");
		} else {
			res.json(result);
		}
	} finally {
		await connection.$pool.end();
	}
});
app.listen(3000);