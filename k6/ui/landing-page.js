import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: 100,
  duration: "30s",
};

export default function () {
  const res = http.get("http://localhost:3000/");
  check(res, {
    "status was OK": (r) => r.status === 200,
  });
}
