import { v4 as uuidv4 } from 'uuid';
import { TryCatch } from '../middlewares/error.js';
import ErrorHandler from "../utils/utility-class.js";
import { db } from '../utils/db.js';
import { client } from '../utils/cache.js';


export const shorten = TryCatch(async (req, res, next) => {
    const { longUrl } = req.body;
    if (!longUrl) return next(new ErrorHandler('Long URL is required', 400));

    let short_code = uuidv4().split('-')[0];
    let exists = true;

    while (exists) {
        const row = await db('url_shortener').where({ short_code }).first();
        if (row) {
            short_code = uuidv4().split('-')[0];
        } else {
            exists = false;
        }
    }

    const result = await db('url_shortener').returning('*').insert({ short_code, original_url: longUrl });
    // await client.set('code:' + short_code, JSON.stringify(result[0]), { EX: 60 * 60 * 24 });
    return res.status(201).send({ short_code });
})

export const getShorten = TryCatch(async (req, res, next) => {
    const { code } = req.params;
    if (!code) return next(new ErrorHandler('code is required', 400));

    const cache = await client.get('code:' + code);
    let result;
    if (cache) {
        result = JSON.parse(cache);
    } else {
        result = await db('url_shortener').where({ short_code: code }).first();
        if (!result) return next(new ErrorHandler('code not found!', 404));
        await client.set('code:' + result.short_code, JSON.stringify(result), { EX: 60 * 60 * 24 });
    }

    const ip = '192.168.1.8';
    const referrer = req.headers.referer || 'dev';

    await db('url_access_logs').insert({ short_code: code, ip, referrer });

    return res.status(302).redirect(result.original_url)
})

export const getAllCode = TryCatch(async (req, res, next) => {
    const result = await db.select('*').from('url_shortener').orderBy('created_at', 'desc');
    if (!result) return next(new ErrorHandler('No codes found!', 404));
    return res.status(200).json(result);
});


export const analyzeShorten = TryCatch(async (req, res, next) => {
    const { code } = req.params;
    if (!code) return next(new ErrorHandler('code is required', 400));

    const total = await db('url_access_logs').where({ short_code: code }).count().first();


    const last_access = await db('url_access_logs').select('accessed_at').where({ short_code: code }).orderBy('accessed_at', 'desc')

    const referrers = await db('url_access_logs').select('referrer').count().where({ short_code: code }).groupBy('referrer');

    const ipGroups = await db('url_access_logs').select('ip').count().where({ short_code: code }).groupBy('ip');

    return res.status(200).send({ total: total.count, last_access, referrers, ip_groups: ipGroups });
})

