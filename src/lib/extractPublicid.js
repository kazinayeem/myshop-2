function extractPublicId(secureUrl) {
  const url = new URL(secureUrl);
  const parts = url.pathname.split("/");
  const versionIndex = parts.findIndex((p) => /^v\d+$/i.test(p));
  const publicIdParts = parts.slice(versionIndex + 1);
  const lastPart = publicIdParts[publicIdParts.length - 1];
  publicIdParts[publicIdParts.length - 1] = lastPart.split(".")[0];
  return publicIdParts.join("/");
}

export default extractPublicId;
