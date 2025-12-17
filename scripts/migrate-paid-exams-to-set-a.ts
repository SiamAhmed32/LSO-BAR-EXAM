/**
 * Migration script to convert existing paid exams to Set A
 * Uses raw SQL to update exams directly
 * Run: npx tsx scripts/migrate-paid-exams-to-set-a.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { Client } from 'pg';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

async function migratePaidExamsToSetA() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Starting migration: Converting paid exams to Set A...');

    // Update Barrister Paid to Set A
    const barristerResult = await client.query(
      `UPDATE exams SET "examSet" = 'SET_A' WHERE "examType" = 'BARRISTER' AND "pricingType" = 'PAID' AND "examSet" IS NULL RETURNING id`
    );
    console.log(`✅ Updated ${barristerResult.rowCount} Barrister Paid exam(s) to Set A`);

    // Update Solicitor Paid to Set A
    const solicitorResult = await client.query(
      `UPDATE exams SET "examSet" = 'SET_A' WHERE "examType" = 'SOLICITOR' AND "pricingType" = 'PAID' AND "examSet" IS NULL RETURNING id`
    );
    console.log(`✅ Updated ${solicitorResult.rowCount} Solicitor Paid exam(s) to Set A`);

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

migratePaidExamsToSetA();

