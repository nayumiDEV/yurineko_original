import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { UserModule } from 'src/user/user.module';
import { TeamMemberResolver, TeamResolver } from './team.resolver';

@Module({
  imports: [UserModule],
  controllers: [TeamController],
  providers: [TeamService, TeamResolver, TeamMemberResolver]
})
export class TeamModule { }
