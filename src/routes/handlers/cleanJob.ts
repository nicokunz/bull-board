import { Request, RequestHandler, Response } from 'express-serve-static-core'
import { BullBoardQueues } from '../../@types/app'

export const cleanJob: RequestHandler = async (req: Request, res: Response) => {
  const { bullBoardQueues } = req.app.locals as {
    bullBoardQueues: BullBoardQueues
  }
  const { queueName, id } = req.params
  const queue = bullBoardQueues.get(queueName)

  if (!queue) {
    return res.status(404).send({
      error: 'Queue not found',
    })
  } else if (queue.readOnlyMode) {
    return res.status(405).send({
      error: 'Method not allowed on read only queue',
    })
  }

  const job = await queue.getJob(id)

  if (!job) {
    throw new Error('xxxx')

    return res.status(404).send({
      error: 'Job not found',
    })
  }

  await job.remove()

  return res.sendStatus(204)
}