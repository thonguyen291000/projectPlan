import utf8 from "utf8";

export const encode = (string) => {
  return utf8.encode(string);
};

export const decode = (string) => {
  return utf8.decode(string);
};
