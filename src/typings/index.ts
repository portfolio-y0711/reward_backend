import { NextFunction, Request, Response } from 'express'

export interface IHttpRequest {
    body: Request["body"],
    query: Request["query"],
    params: Request["params"],
}

export interface IHttpResponse {
  statusCode: number,
  message?: string,
  body?: any,
} 