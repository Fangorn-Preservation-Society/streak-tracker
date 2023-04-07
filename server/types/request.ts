import { Request as ExpressRequest } from 'express'

export interface Request extends ExpressRequest {
    userId?: string
}
export interface AuthedRequest extends ExpressRequest {
    userId?: string
}
