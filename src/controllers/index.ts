import { Request, Response } from 'express'

interface IUserController {
  test: (req: Request, res: Response) => void
}

export default (): IUserController => {
  const test = (req: Request, res: Response) => {
      res.json("test!")
  }
  return {
    test  
  }
}

export {
  IUserController
}
