import dotenv from "dotenv";
import express from 'express'
import path from 'path'

const envPath = path.resolve(__dirname, '.env')
// console.log('ENV file path:', envPath)
const env = dotenv.config({ path: envPath});

if(env.error) throw env.error

export const app = express()
export const port = 8888
export const MONGODB_URI = process.env.MONGODB_URI
export const JWT_SECRET = process.env.JWT_SECRET
