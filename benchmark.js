import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s',
      duration: '60s',
      preAllocatedVUs: 10,
      maxVUs: 100,
    },
  },
  discardResponseBodies: true
};

// export const options = {
//   discardResponseBodies: true,
//   scenarios: {
//     contacts: {
//       executor: 'constant-vus',
//       vus: 130,
//       duration: '10s',
//     },
//   },
// };

export default function () {
  const res = http.get('http://localhost:3000/products/1/related');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}