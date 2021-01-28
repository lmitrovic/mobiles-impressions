const { response } = require('express');
const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//niz tokena koji su istekli
let expiredTokens = [];

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'skriptispit'
});

const route = express.Router();

route.use(express.json());

route.post('/sign-up', (req, res) => {

    //ne zelimo da cuvamo password onako kako ga je korisnik uneo, pa ga zbog toga hash-iramo
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).send({
                msg: err
            });
        } else {
            let query = "insert into baza_users (username, password) values (?,?)";
            let formated = mysql.format(query, [req.body.username, hash]);

            pool.query(formated, (err, response) => {
                if (err) {
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    query = "select id,username from baza_users where id=?";
                    formated = mysql.format(query, [response.insertId]);

                    pool.query(formated, (err, rows) => {
                        if (err) {
                            res.status(500).send(err.sqlMessage);
                        }
                        else {

                            const token = jwt.sign({ user: rows[0] }, "MySecret", { expiresIn: 100 * 60 * 100000 });
                            res.json(token);
                        }
                    });
                }
            });
        }
    });
});

route.post('/login', (req, res) => {

    const password = req.body.password;

    //prvo izvlacimo user-a iz baze na osnovu unetog username-a
    const query = "select * from baza_users where username=?";
    const formated = mysql.format(query, [req.body.username]);

    pool.query(formated, (err, response) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {
            //ako je unet nepostojeci username, bacamo gresku
            if (!response || response.length === 0) {
                res.status(404).send("Bad credentials");
            }
            else {
                //ako je unet postojeci username, proveravamo da li je unet tacan password
                if (!bcrypt.compareSync(password, response[0]['password'])) {
                    res.status(404).send("Invalid password");
                }
                else {
                    //ako su tacni username i password kreiramo token i vracamo odgovor
                    const token = jwt.sign({ user: { id: response[0].id, username: response[0].username } }, "MySecret", { expiresIn: 100 * 60 });
                    res.json({ id: response[0].id, username: response[0].username, token: token });

                }
            }
        }
    });

});

route.post('/logout', (req, res) => {
    //kada se user logout-uje zelimo da njegov token smestimo u niz tokena koji su istekli
    const token = req.body.token;
    const t1 = expiredTokens.find(element => element === token);

    if (!t1) {
        expiredTokens.push(token);
    }

    res.json({ status: true });
});

route.post('/verify', (req, res) => {
    //proveravamo da li je token validan, odnosno da li je istekao

    const token = req.body.token;
    const t1 = expiredTokens.find(element => element === token);

    if (!t1) {
        jwt.verify(token, "MySecret", (err, user) => {
            if (err) {
                res.json({ success: false, error: err });
            }
            else {
                res.json({ success: true, user: user });
            }
        });
    }
    else {
        res.json({ success: false, error: "expired" });
    }

});

module.exports = { expiredTokens: expiredTokens, route: route };