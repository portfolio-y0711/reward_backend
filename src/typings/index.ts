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

export type EVENT_TYPE = 'REVIEW' | 'BLAR_BLAR'

export interface IEvent {
  type: EVENT_TYPE
  [name: string]: any
}

export interface IEventDatabaseModels {
  userModel: IUserModel
  placeModel: IPlaceModel
  reviewModel: IReviewModel
}

type REVIEW_ACTION = 'ADD' | 'MOD' | 'DELETE'

export interface IReviewEvent {
  type: string
  action: REVIEW_ACTION
  reviewId: string
  content: string
  attachedPhotoIds: string[] | string
  userId: string
  placeId: string
}
