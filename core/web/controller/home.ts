import { Router } from 'express'

export default (globalContext: any): Router => {
  const router = Router()

  router.get('/', (req, res) => {
    res.render('home', {
      ...globalContext,
      title: 'Home',
      version: '0.0.1'
    })
  })

  return router
}
