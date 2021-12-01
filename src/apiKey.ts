import protobuf from "protobufjs";
import { createCipheriv, KeyObject } from 'crypto';
import { v4 as uuidv4 } from "uuid";
import { toBuffer } from "uuid-buffer";
import { randomFillSync } from "crypto";

type PublicKey = KeyObject;

function encrypt(plaintext: string, publicKey: PublicKey, iv: Buffer) {
  const algorithm = "aes-256-gcm";
  const cipher = createCipheriv(algorithm, publicKey, iv, { authTagLength: 16 });
  const ciphertext = cipher.update(plaintext);
  cipher.final();
  const tag = cipher.getAuthTag();

  return { ciphertext, tag };
}

const uuid = toBuffer(uuidv4());

type Payload = {
  version: string,
  keyId: Buffer,
  cipherText: Buffer,
  iv: Buffer
}

const publicKey = "" as PublicKey;

const iv = Buffer.from(randomFillSync(new Uint8Array(96 >> 3)));
const { cipherText, tag } = encrypt("Oh Lordy, troubles so hard", publicKey, iv);

const payload: Payload = {
  version: "0.1.1",
  keyId: uuid,
  cipherText: Buffer.from("h5vi_S3hF3jRM5O3qV3oaO8dbxi7UI4mY-QPAJUTY0Ev0OM9eFl1Ng", "base64"),
  iv: iv
};

const root = await protobuf.load("./protobuf/ApiKey.proto");
const ApiKeyMessage = root.lookupType("Api.ApiKey");
const message = ApiKeyMessage.create(payload);

console.log(Buffer.from(ApiKeyMessage.encode(message).finish()).toString("base64"));
