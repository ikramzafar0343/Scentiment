import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn', 'log'] });
  const users = app.get(UsersService);

  const email = process.env.ADMIN_EMAIL || 'admin@scentiment.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123456';

  const existing = await users.findByEmail(email);
  if (existing) {
    // Ensure role is admin
    if (existing.role !== 'admin') {
      await users.update(existing._id.toString(), { role: 'admin' });
    }
    // eslint-disable-next-line no-console
    console.log(`[seed-admin] Admin already exists: ${email}`);
    await app.close();
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await users.create({
    email,
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
  } as any);

  // Promote to admin
  const created = await users.findByEmail(email);
  if (created) {
    await users.update(created._id.toString(), { role: 'admin' });
  }

  // eslint-disable-next-line no-console
  console.log(`[seed-admin] Created admin: ${email}`);
  // eslint-disable-next-line no-console
  console.log(`[seed-admin] Password: ${password}`);

  await app.close();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[seed-admin] Failed:', err);
  process.exit(1);
});

