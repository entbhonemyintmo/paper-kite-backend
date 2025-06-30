const authController = require("../src/controllers/authController");
const User = require("../src/models/User");
const argon = require("argon2");
const generateJwtToken = require("../src/utils/generateJwtToken");
const HttpException = require("../src/utils/httpException");

jest.mock("../src/models/User");
jest.mock("argon2");
jest.mock("../src/utils/generateJwtToken");

describe("authController", () => {
	describe("singUp", () => {
		let req, res, next;

		beforeEach(() => {
			req = { body: { name: "A", email: "a@a.com", password: "pass" } };
			res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
			next = jest.fn();
		});

		it("should return 400 if fields missing", async () => {
			req.body = {};
			await authController.singUp(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should return 400 if email exists", async () => {
			User.findOne.mockResolvedValue({});
			await authController.singUp(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should create user and return 201", async () => {
			User.findOne.mockResolvedValue(null);
			argon.hash.mockResolvedValue("hashed");
			User.mockImplementation(function (data) {
				return { save: jest.fn().mockResolvedValue(data) };
			});
			await authController.singUp(req, res, next);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.send).toHaveBeenCalledWith({
				statusCode: 201,
				message: "User created successfully!",
			});
		});
	});

	describe("singIn", () => {
		let req, res, next, user;

		beforeEach(() => {
			req = { body: { email: "a@a.com", password: "pass" } };
			res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
			next = jest.fn();
			user = { id: "1", email: "a@a.com", password: "hashed" };
		});

		it("should return 400 if fields missing", async () => {
			req.body = {};
			await authController.singIn(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should return 404 if user not found", async () => {
			User.findOne.mockResolvedValue(null);
			await authController.singIn(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should return 401 if password incorrect", async () => {
			User.findOne.mockResolvedValue(user);
			argon.verify.mockResolvedValue(false);
			await authController.singIn(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should return tokens if login success", async () => {
			User.findOne.mockResolvedValue(user);
			argon.verify.mockResolvedValue(true);
			generateJwtToken.mockReturnValue("token");
			await authController.singIn(req, res, next);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({
				access_token: "token",
				refresh_token: "token",
				type: "Bearer",
			});
		});
	});

	describe("refreshToken", () => {
		it("should return new access token", () => {
			const req = { user: { id: "1", email: "a@a.com" }, refresh_token: "rtok" };
			const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
			const next = jest.fn();
			generateJwtToken.mockReturnValue("token");
			authController.refreshToken(req, res, next);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({
				access_token: "token",
				refresh_token: "rtok",
				type: "Bearer",
			});
		});
	});
});
