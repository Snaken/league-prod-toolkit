import { Response, Router } from 'express';
import { LPTEvent } from '../../eventbus/LPTE';

import lpte from '../../eventbus/LPTEService';

const router = Router();

router.post('/events/ingest', (req, res) => {
  lpte.emit(req.body);
  res.status(200).send();
});

router.post('/events/request', (req, res) => {
  // Register handler first
  let wasHandled = false;
  const handler = (e: LPTEvent) => {
    // unregister the handler
    lpte.unregisterHandler(handler);

    wasHandled = true;
    res.status(200).send(e);
  };
  lpte.on(req.query.namespace as string, req.query.type as string, handler);

  // Emit request next
  lpte.emit(req.body);

  // Set timer for timeout
  const timeout = parseInt((req.query.timeout || '1000') as string);
  setTimeout(() => {
    if (!wasHandled) {
      // We should time out now
      lpte.unregisterHandler(handler);

      res.status(404).send();
    }
  }, timeout);
});

export default router;