import { Request } from 'express'
import { User } from '/user/user.model'

interface RequestdWithUser {
  user: user; 
}