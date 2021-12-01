import { promises as fs } from "fs"
import { resolve } from "path";

import { FlattenedEncrypt, generateKeyPair, importSPKI } from "jose";

const ecKey = await generateKeyPair("ECDH-ES+A256KW");

const fixturesDir = "./fixtures";
//
// // const publicKey = readFileSync(
// //   resolve(fixturesDir, "public_key.txt"),
// //   { encoding: "base64" }
// // );

async function fetchPublicKey(): Promise<string> {
  const publicKey = await fs.readFile(
    resolve(fixturesDir, "public_key.txt")
  );

  return Buffer.from(publicKey.toString(), "base64").toString("utf-8");
}

async function fetchPrivateKey(): Promise<string> {
  const privateKey = await fs.readFile(
    resolve(fixturesDir, "private_key.txt")
  );

  return Buffer.from(privateKey.toString(), "base64").toString("utf-8");
}

const publicKey = await fetchPublicKey();

console.log(publicKey);
//console.log(publicKey.toString("utf-8"));
// const privateKey = readFileSync(
//   resolve(fixturesDir, "private_key.txt"),
//   { encoding: "base64" }
// );


const jwe = await new FlattenedEncrypt(
  new TextEncoder().encode(
    'It’s a dangerous business, Frodo, going out your door.'
  )
)
.setProtectedHeader({ alg: "ECDH-ES+A256KW", enc: 'A256GCM'})
.encrypt(await importSPKI(publicKey.toString(), "A256GCMKW"))

console.log(jwe);
