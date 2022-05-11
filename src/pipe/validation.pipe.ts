import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { VALIDATION } from 'src/constants';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    
    if (!metadata.metatype) { // possible to replace
      throw {};
    }

    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map((err) => {

        console.log(errors);
        console.log(err.constraints)
        if (!err.constraints) {
          throw new HttpException(VALIDATION, HttpStatus.BAD_REQUEST);;
        }

        return `${err.property} - ${Object.values(err.constraints).join(', ')}`;
      });

      throw new HttpException(messages, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}
