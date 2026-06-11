const express = require('express');
const router = express.Router();
const { notionClient } = require('./notion');
const { formatResponse } = require('./utils');
const logger = require('./logger');

const FAITH_DB_ID = '39e2135fbb534d55a991dc2a5510eac7';

async function addRecord(subject, bible, date) {
    const properties = {
        title: {
            title: [{ text: { content: subject } }]
        },
        '본문': {
            rich_text: [{ text: { content: bible } }]
        }
    };

    if (date) {
        properties['날짜'] = { date: { start: date } };
    }

    return await notionClient.pages.create({
        parent: { database_id: FAITH_DB_ID },
        properties
    });
}

router.post('/add-record', async (req, res) => {
    try {
        const { subject, bible, date, format = 'json' } = req.body;
        logger.debug('Request: faith/add-record ' + JSON.stringify({ subject, bible, date, format }));

        if (!subject || !bible) {
            throw new Error('subject와 bible이 필요합니다.');
        }

        const page = await addRecord(subject, bible, date);
        const response = { success: true, pageId: page.id };
        logger.debug('Response: ' + JSON.stringify(response));
        formatResponse(res, response, format);
    } catch (error) {
        const errorResponse = { success: false, error: error.message };
        logger.error('Error: ' + JSON.stringify(errorResponse));
        formatResponse(res, errorResponse, req.body?.format);
    }
});

module.exports = { router };
