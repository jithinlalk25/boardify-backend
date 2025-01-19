import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InstituteController } from './institute.controller';
import { InstituteService } from './institute.service';
import { Institute, InstituteSchema } from './schemas/institute.schema';
import {
  InstituteAdmin,
  InstituteAdminSchema,
} from './schemas/institute-admin.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Institute.name, schema: InstituteSchema },
      { name: InstituteAdmin.name, schema: InstituteAdminSchema },
    ]),
  ],
  controllers: [InstituteController],
  providers: [InstituteService],
  exports: [InstituteService],
})
export class InstituteModule {}
