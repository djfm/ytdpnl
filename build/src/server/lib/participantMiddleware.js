"use strict";
exports.__esModule = true;
exports.createParticipantMiddleWare = void 0;
var createParticipantMiddleWare = function (createLogger) {
    return function (req, res, next) {
        var log = createLogger(req.requestId);
        var participantCode = req.headers['x-participant-code'];
        log('Checking participant code:', participantCode);
        if (typeof participantCode !== 'string') {
            res.status(401).json({ kind: 'Failure', message: 'Invalid participant code header', code: 'NOT_AUTHENTICATED' });
            return;
        }
        if (!participantCode) {
            res.status(401).json({ kind: 'Failure', message: 'Missing participant code header', code: 'NOT_AUTHENTICATED' });
            return;
        }
        log('Participant code:', participantCode);
        var sessionUuid = req.headers['x-session-uuid'];
        if (sessionUuid && typeof sessionUuid === 'string') {
            log('Session UUID:', sessionUuid);
            req.sessionUuid = sessionUuid;
        }
        req.participantCode = participantCode;
        next();
    };
};
exports.createParticipantMiddleWare = createParticipantMiddleWare;
exports["default"] = exports.createParticipantMiddleWare;
