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

const semaComments = Joi.object().keys({
    user_id: Joi.number().required(),
    nickname: Joi.string().trim().min(1).max(15).required(),
    comment: Joi.string().max(1000).required(),
    model: Joi.string().max(20).required()
});

const semaCommentsForModel = Joi.object().keys({
    model: Joi.string().max(20).required()
});

const semaEditComment = Joi.object().keys({
    comment: Joi.string().max(1000).required()
});

route.use(express.json());

route.get('/comments', (req, res) => {
    pool.query('select id, username, content from baza_comment', (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(rows);
    });
});

route.post('/comments', (req, res) => {
    let { error } = Joi.validate(req.body, semaComments);

    if (error)
        res.status(400).send(error.details[0].message);
    else {

        let queryId = "select * from baza_mobile where model like ?";
        let formattedId = mysql.format(queryId, [req.body.model]);
        pool.query(formattedId, (err, rows) => {
            if (err) {
                res.status(500).send(err.sqlMessage);
            } else {
                let idPhone = rows[0].id;
                let query = "insert into baza_comment (user_id, username, content, mobile_id) values (?, ?, ?, ?)";
                let formated = mysql.format(query, [req.body.user_id, req.body.nickname, req.body.comment, idPhone]);

                pool.query(formated, (err, response) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else {
                        query = 'select id, username, content from baza_comment where id=?';
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

    }
});

// Vraca komentare za prosledjeni telefon
route.get('/comments/:model', (req, res) => {

    let query = 'select c.id, c.username, c.content from baza_comment c join baza_mobile m on (c.mobile_id=m.id) where m.model like ?';
    let formated = mysql.format(query, [req.params.model]);
    let { error } = Joi.validate(req.params, semaCommentsForModel);
    if (error)
        res.status(400).send(error.details[0].message);
    else {
        pool.query(formated, (err, rows) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else
                res.send(rows);

        });
    }
});

// Izmena mobiles (vraca korisniku ceo red iz baze)
route.put('/comments/:id/:userId', (req, res) => {
    let { error } = Joi.validate(req.body, semaEditComment);

    if (error)
        res.status(400).send(error.details[0].message);
    else {
        let query = "update baza_comment set content=? where id=? and user_id=?";
        let formated = mysql.format(query, [req.body.comment, req.params.id, req.params.userId]);

        pool.query(formated, (err, response) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                query = 'select * from baza_comment where id=?';
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

// Brisanje comments (vraca korisniku ceo red iz baze)
route.delete('/comments/:id', (req, res) => {
    let query = 'select * from baza_comment where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let poruka = rows[0];

            let query = 'delete from baza_comment where id=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(poruka);
            });
        }
    });
});

module.exports = route;
