const smsController = require("../src/controllers/smsController");
const Batch = require("../src/models/Batch");
const readCsv = require("../src/utils/readCsv");
const HttpException = require("../src/utils/httpException");

jest.mock("../src/models/Batch");
jest.mock("../src/utils/readCsv");

describe("smsController", () => {
	describe("createBatch", () => {
		let req, res, next;

		beforeEach(() => {
			req = {
				file: { buffer: Buffer.from("test") },
				body: { description: "desc", scheduleAt: "2024-01-01" },
				user: { id: "user1" },
			};
			res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
			next = jest.fn();
			readCsv.mockResolvedValue([{ phone: "123" }]);
			Batch.mockImplementation(function (data) {
				return { save: jest.fn().mockResolvedValue(data) };
			});
		});

		it("should create a batch and return 201", async () => {
			await smsController.createBatch(req, res, next);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.send).toHaveBeenCalledWith({
				statusCode: 201,
				message: "Batch created successfully!",
			});
		});

		it("should call next with error if file not provided", async () => {
			req.file = null;
			await smsController.createBatch(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});

		it("should call next with error if fields missing", async () => {
			req.body.description = "";
			await smsController.createBatch(req, res, next);
			expect(next).toHaveBeenCalledWith(expect.any(HttpException));
		});
	});

	describe("getAllBatches", () => {
		let req, res, next;

		beforeEach(() => {
			req = { user: { id: "user1" } };
			res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
			next = jest.fn();
			Batch.find = jest.fn().mockResolvedValue([{ id: 1 }]);
		});

		it("should return batches", async () => {
			await smsController.getAllBatches(req, res, next);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith([{ id: 1 }]);
		});
	});
});
