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
      await testService.deleteAll();
      await testService.createUser();

      // await testService.deleteGrubMember();
      // await testService.deleteGrub();
      // await testService.createGrub();
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
  });

  // Join
  describe('POST /api/grubs/join', () => {
    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/grubs/join')
        .set('Authorization', 'test')
        .send({
          grub_id: '1',
        });

      logger.info(response.body);

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });

    it('should be able to join grub', async () => {
      const grubId = await testService.getGrubId();
      const response = await request(app.getHttpServer())
        .post('/api/grubs/join')
        .set('Authorization', 'test2')
        .send({
          grub_id: grubId.grub_id,
        });

      logger.info(response.body);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if user already joined', async () => {
      // await testService.createGrubMember();
      const grubId = await testService.getGrubId();
      const response = await request(app.getHttpServer())
        .post('/api/grubs/join')
        .set('Authorization', 'test')
        .send({
          grub_id: grubId.id,
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  });
});
