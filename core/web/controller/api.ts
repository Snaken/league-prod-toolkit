import { Router } from 'express'

import lpte from '../../eventbus/LPTEService'

const router = Router()

router.post('/events/ingest', (req, res) => {
  lpte.emit(req.body)
  res.status(200).send({})
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/events/request', async (req, res) => {
  const response = await lpte.request(req.body)

  if (response !== null) {
    return res.status(200).send(response)
  }
  return res.status(500).send({
    error: 'request timed out'
  })
})

export default router
