import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('GrubController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/grubs', () => {
    beforeEach(async () => {
      await testService.deleteGrubMember();
      await testService.deleteGrub();
      //   await testService.createGrub();
    });
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/grubs')
        .set('Authorization', 'test')
        .send({
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to create grub', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/grubs')
        .set('Authorization', 'test')
        .send({
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test');
    });

    // it('should be rejected if username already exists', async () => {
    //   await testService.createUser();
    //   const response = await request(app.getHttpServer())
    //     .post('/api/users')
    //     .send({
    //       username: 'test',
    //       name: 'test',
    //       password: 'test',
    //     });

    //   logger.info(response.body);

    //   expect(response.status).toBe(400);
    //   expect(response.body.errors).toBeDefined();
    // });
  });
});
