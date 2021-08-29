import { IDatabaseConnector } from '@app/data/connection'
import { IPlaceModel } from '@app/data/models/place'
import { IReviewModel } from '@app/data/models/review'
import { IUserModel } from '@app/data/models/user'
import { Request } from 'express'

export interface IHttpRequest {
  body: Request['body']
  query: Request['query']
  params: Request['params']
}

export interface IHttpResponse {
  statusCode: number
  message?: string
  body?: any
}

export interface IEvent {
  type: string
  [name: string]: any
}

export interface IEventDatabaseModels {
  userModel: IUserModel,
  placeModel: IPlaceModel,
  reviewModel: IReviewModel
}
