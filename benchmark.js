import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 2000,
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 20,
      maxVUs: 20,
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
  const res = http.get('http://localhost:3000/products/1/styles');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
}