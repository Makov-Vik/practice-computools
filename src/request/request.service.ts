import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateRequsetDto } from './dto/create-request.dto';
import { Request } from './request.model';
import { mailer } from '../nodemailer';
import { UserService } from 'src/user/user.service';
import { RECIPIENT_NOT_FOUND } from 'src/constants';

@Injectable()
export class RequestService {
  constructor(@InjectModel(Request) private requestRepository: typeof Request, private userService: UserService,) {}
  
  async requestJoinTeam(req: any, input: CreateRequsetDto) {
    // or recievd only 'team' in input and search manager throught team ?????????????????
    let manager;
    try {
      manager = await this.userService.getUserById(input.to);
    } catch(e) {
      throw new HttpException(RECIPIENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }


    const request = {
      from: req.user.id,
      to: input.to,
      type: 'join',
      description: `confirm joining team ${input.team} of player ${req.user.email}`,
    }
    
    const message = {
      to: manager.email,
      subject: 'confirm join',
      text: '',
      html: `
      <p>${request.description}</p>
  `,
    };
    mailer(message);

    return await this.requestRepository.create(request);
  }
}
