import { IPlaceModel } from '@app/data/models/place'
import { IReviewModel } from '@app/data/models/review'
import { IUserModel } from '@app/data/models/user'
import { Request } from 'express'
import bunyan from 'bunyan'

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

export type REWARD_OPERATION = 'ADD' | 'SUB'

export type REWARD_REASON = 'NEW' | 'MOD' | 'DEL' | 'RED'

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
  type: EVENT_TYPE
  action: REVIEW_ACTION
  reviewId: string
  content: string
  attachedPhotoIds: string[] | string
  userId: string
  placeId: string
}

export class ValidationError {
  message: string
  code: number
  constructor(code: number, message: string) {
    this.message = message
    this.code = code
  }
  static badRequest(msg: any) {
    return new ValidationError(422, msg)
  }
}

export class ContextError {
  _message: string
  _code: number

  constructor(message: string, code: number = 500) {
    this._message = message
    this._code = code
  }
  static contextError(msg: any, code?: number) {
    return new ContextError(msg, code)
  }
  get message() {
    return this._message
  }

  get code() {
    return this._code
  }
}

declare global {
  namespace NodeJS {
    interface Global {
      LOGGER: bunyan
    }
  }
}
