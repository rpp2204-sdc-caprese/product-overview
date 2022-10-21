const database = require("../database.js");
const app = require('../index.js');
const request = require('supertest');

describe("GET products", () => {
  test("Should return status code of 200", async () => {
    const response = await request(app).get('/products/')
    expect(response.statusCode).toBe(200);
  })

  test("Should return ten products", async () => {
    const response = await request(app).get('/products/')

    expect((response.text.match(/"id"/g) || []).length).toBe(10);
  })

})

describe("GET product info", () => {
  test("Should return status code of 200", async () => {
    const response = await request(app).get('/products/1/')
    expect(response.statusCode).toBe(200);
  })

  test("Should return information on the queried product", async () => {
    const response = await request(app).get('/products/1')
    console.log(response.text)
    expect(JSON.parse(response.text).name).toBe("Camo Onesie");
  })

})

describe("GET style info", () => {
  test("Should return status code of 200", async () => {
    const response = await request(app).get('/products/1/styles/')
    expect(response.statusCode).toBe(200);
  })

  test("Should return style information on the queried product", async () => {
    const response = await request(app).get('/products/1/styles/')

    expect(JSON.parse(response.text).results === undefined).toBe(false);
  })

})

describe("GET related info", () => {
  test("Should return status code of 200", async () => {
    const response = await request(app).get('/products/1/related')
    expect(response.statusCode).toBe(200);
  })

  test("Should return related products based on the queried product", async () => {
    const response = await request(app).get('/products/1/related')
    expect(typeof JSON.parse(response.text)).toBe("object");
  })

})