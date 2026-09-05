/**
 * Applique db/schema.sql sur Neon.
 *
 * Le driver HTTP n'accepte qu'une instruction par appel : on découpe donc le
 * fichier sur les ";" situés HORS des blocs $$ ... $$, sans quoi le corps des
 * fonctions plpgsql serait tronqué à son premier point-virgule.
 *
 * Utilise la connexion NON POOLÉE : le pooler n'est pas fait pour du DDL.
 *
 *   node scripts/db-apply-schema.js
 */
import { readFileSync } from 'node:fs';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
if (!url) {
    console.error('✖ DATABASE_URL_UNPOOLED (ou DATABASE_URL) est requis.');
    process.exit(1);
}

/** Découpe un script SQL en instructions, en respectant les blocs $$ ... $$. */
function splitStatements(sqlText) {
    const statements = [];
    let current = '';
    let inDollar = false;

    for (let i = 0; i < sqlText.length; i++) {
        if (sqlText[i] === '$' && sqlText[i + 1] === '$') {
            inDollar = !inDollar;
            current += '$$';
            i++;
            continue;
        }
        if (sqlText[i] === ';' && !inDollar) {
            if (current.trim()) statements.push(current.trim());
            current = '';
            continue;
        }
        current += sqlText[i];
    }
    if (current.trim()) statements.push(current.trim());

    // On écarte les fragments qui ne sont que des commentaires.
    return statements.filter((s) =>
        s.split('\n').some((line) => line.trim() && !line.trim().startsWith('--'))
    );
}

const sql = neon(url);
const statements = splitStatements(readFileSync('db/schema.sql', 'utf8'));

console.log(`${statements.length} instructions à appliquer\n`);

for (const [i, statement] of statements.entries()) {
    const label = statement.replace(/\s+/g, ' ').slice(0, 68);
    try {
        await sql.query(statement);
        console.log(`  ✓ ${String(i + 1).padStart(2)} ${label}`);
    } catch (error) {
        console.error(`  ✖ ${String(i + 1).padStart(2)} ${label}`);
        console.error(`     ${error.message}`);
        process.exit(1);
    }
}

console.log('\nSchéma appliqué.');
