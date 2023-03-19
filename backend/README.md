npm run start:dev
http://localhost:3000/graphql

docker-compose up -d
docker exec -it postgres psql -U udemy_user udemydb

# nest graphql

npm i @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm i class-validator class-transformer

### パスワードハッシュ化

npm i bcrypt
npm i --save-dev @types/bcrypt

# Prisma

npm install prisma --save-dev
npx prisma init
npx prisma migrate dev --name 任意(init) <- schema いじったら

npx prisma studio(起動)

### 認証

npm i @nestjs/passport passport passport-local
npm i --save-dev @types/passport-local

#### jwt

npm i @nestjs/jwt passport-jwt
npm i --save-dev @types/passport-jwt

### クライアント

npm i @prisma/client

nest g module prisma
nest g service prisma --no-spec

https://docs.nestjs.com/recipes/prisma

```
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

```
