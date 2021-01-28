const express = require('express');
const Joi = require('joi');
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    database: 'skriptispit'
});

const route = express.Router();

const semaMobiles = Joi.object().keys({
    model: Joi.string().min(1).max(50).required(),
    producer: Joi.string().max(20).required(),
    price: Joi.number().empty("").allow(null).default(500)
});

route.use(express.json());

route.get('/mobiles', (req, res) => {

    pool.query('select * from baza_mobile', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.post('/mobiles', (req, res) => {

    let { error } = Joi.validate(req.body, semaMobiles);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "insert into baza_mobile (model, producer, price) values (?, ?, ?)";
        let formated = mysql.format(query, [req.body.model, req.body.producer, req.body.price]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from baza_mobile where id=?';
                formated = mysql.format(query, [response.insertId]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }
});

route.get('/mobiles/:id', (req, res) => {
    let query = 'select * from baza_mobile where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows[0]);

    });
});

route.put('/mobiles/:id', (req, res) => {
    let { error } = Joi.validate(req.body, semaMobiles);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update baza_mobile set model=?, producer=?, price=? where id=?";
        let formated = mysql.format(query, [req.body.model, req.body.producer, req.body.price, req.params.id]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from baza_mobile where id=?';
                formated = mysql.format(query, [req.params.id]);

                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.send(rows[0]);
                });
            }
        });
    }

});

route.delete('/mobile/:id', (req, res) => {
    let query = 'select * from baza_mobile where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let telefon = rows[0];

            let query = 'delete from baza_mobile where id=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(telefon);
            });
        }
    });
});

module.exports = route;
