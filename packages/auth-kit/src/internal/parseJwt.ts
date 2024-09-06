import { base64 } from "@oslojs/encoding";

export function parseJwt(token: string) {
  try {
    let body = token.split(".")[1];
    let decoded = new TextDecoder().decode(base64.decode(body));
    let bodyJSON = JSON.parse(decoded);
    return bodyJSON;
  } catch (e) {
    throw new Error("Invalid JWT");
  }
}
