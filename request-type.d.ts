import { Request } from 'express'
import { User } from '/user/user.model'

interface RequestdWithUser extends {user: User} {
  user: user; 
}