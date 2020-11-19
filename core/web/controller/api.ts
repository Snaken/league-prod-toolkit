import { Response, Router } from 'express'
import { LPTEvent } from '../../eventbus/LPTE'

import lpte from '../../eventbus/LPTEService'

const router = Router()

router.post('/events/ingest', (req, res) => {
  lpte.emit(req.body)
  res.status(200).send({})
})

router.post('/events/request', async (req, res) => {
  const response = await lpte.request(req.body)

  if (response) {
    return res.status(200).send(response)
  }
  return res.status(500).send({
    error: 'request timed out'
  })
})

export default router
