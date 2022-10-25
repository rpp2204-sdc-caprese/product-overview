import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100,
      timeUnit: '1s',
      duration: '10s',
      preAllocatedVUs: 100,
      maxVUs: 200,
    },
  },
  discardResponseBodies: true
};

export default function () {
  const res = http.get('http://localhost:3000/products/');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(0.5);
}