import { Router } from 'express'
import path from 'path'
import send from 'send'
import fs from 'fs'

import { GlobalContext } from '../globalContext'

export default (globalContext: GlobalContext): Router => {
  const router = Router()

  router.get('/:page*', (req, res) => {
    const page = globalContext.module_pages.filter(p => p.id === req.params.page)[0]

    const relativePath = req.params[0] ?? '/'
    const absolutePath = path.join(page.sender.path, page.frontend, relativePath)

    if (!relativePath.includes('/')) {
      const fileContent = fs.readFileSync(path.join(absolutePath, 'index.html'), { encoding: 'utf8' })
      res.render('page_template',
        {
          ...globalContext,
          fileContent,
          title: page.name,
          pageName: page.id
        })
    } else {
      send(req, absolutePath).pipe(res)
    }
  })

  return router
}
