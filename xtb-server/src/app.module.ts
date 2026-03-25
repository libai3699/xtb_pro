import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { AgentModule } from './modules/agent/agent.module';
import { LeadModule } from './modules/lead/lead.module';
import { OrderModule } from './modules/order/order.module';
import { StatsModule } from './modules/stats/stats.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CampaignModule,
    AgentModule,
    LeadModule,
    OrderModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
