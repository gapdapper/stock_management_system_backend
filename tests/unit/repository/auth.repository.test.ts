const mockFindFirst = jest.fn();
const mockInsert = jest.fn();
const mockValues = jest.fn();
const mockReturning = jest.fn();
const mockDelete = jest.fn();
const mockWhere = jest.fn();
const mockOnConflictDoUpdate = jest.fn();
const mockUpdate = jest.fn();
const mockSet = jest.fn();
const mockWhereUpdate = jest.fn();
const mockFindRefreshTokenFirst = jest.fn();

const mockDb = {
  query: {
    users: {
      findFirst: mockFindFirst,
    },
    refreshTokens: {
      findFirst: mockFindRefreshTokenFirst,
    },
  },
  insert: mockInsert,
  update: mockUpdate,
  delete: mockDelete,
};

mockDb.delete = mockDelete;
mockDb.update = mockUpdate;
mockDb.query.refreshTokens = {
  findFirst: mockFindRefreshTokenFirst,
};

jest.mock("@/db/connect", () => ({
  __esModule: true,
  default: mockDb,
}));

beforeEach(() => {
  jest.clearAllMocks();

  mockInsert.mockReturnValue({
    values: mockValues,
  });

  mockValues.mockReturnValue({
    returning: mockReturning,
    onConflictDoUpdate: mockOnConflictDoUpdate,
  });

    mockDelete.mockReturnValue({
    where: mockWhere,
  });

    mockUpdate.mockReturnValue({
    set: mockSet,
  });

    mockSet.mockReturnValue({
    where: mockWhereUpdate,
  });
});

import type { IRefreshToken, IUser } from "@/models/user";
import { findUserByUsername, addUser, revokeRefreshTokenByHashed, upsertRefreshToken, updateRefreshToken, findRefreshToken, getUserProfileById } from "@/repositories/authRepository";
import { refreshToken } from "@/services/authService";

// #region UTC-05-13
describe("UTC-05-13: findUserByUsername()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser = {
    id: 1,
    username: "admin",
    password: "hashedpassword",
    role: "admin",
    refreshToken: null,
  };

  it("ID-01: Should return user when found", async () => {
    mockFindFirst.mockResolvedValueOnce(mockUser);

    const result = await findUserByUsername("admin");

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
  });

  it("ID-02: Should return undefined when not found", async () => {
    mockFindFirst.mockResolvedValueOnce(undefined);

    const result = await findUserByUsername("unknown");

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it("ID-03: Should propagate database error", async () => {
    mockFindFirst.mockRejectedValueOnce(new Error("DB error"));

    await expect(findUserByUsername("anyuser"))
      .rejects
      .toThrow("DB error");

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-14
describe("UTC-05-14: addUser()", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUser: IUser = {
    username: "newuser",
    password: "hashedpassword",
    role: "user",
  };

  it("ID-01: Should insert user and return generated id", async () => {
    mockReturning.mockResolvedValueOnce([{ id: 10 }]);

    const result = await addUser(mockUser);

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockValues).toHaveBeenCalledWith({
      username: "newuser",
      password: "hashedpassword",
      role: "user",
    });
    expect(mockReturning).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ id: 10 });
  });

  it("ID-02: Should propagate database error", async () => {
    mockReturning.mockRejectedValueOnce(new Error("DB error"));

    await expect(addUser(mockUser))
      .rejects
      .toThrow("DB error");

    expect(mockInsert).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-15
describe("UTC-05-15: revokeRefreshTokenByHashed()", () => {

  it("ID-01: Should delete refresh token successfully", async () => {
    mockWhere.mockResolvedValueOnce(undefined);

    await expect(
      revokeRefreshTokenByHashed("hashed-token")
    ).resolves.toBeUndefined();

    expect(mockDelete).toHaveBeenCalledTimes(1);
    expect(mockWhere).toHaveBeenCalledTimes(1);
  });

  it("ID-02: Should propagate database error", async () => {
    mockWhere.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      revokeRefreshTokenByHashed("hashed-token")
    ).rejects.toThrow("DB error");

    expect(mockDelete).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-16
describe("UTC-05-16: upsertRefreshToken()", () => {

  const mockRecord: IRefreshToken = {
    userId: 1,
    token: "hashed-token",
    expiresAt: new Date("2026-01-01"),
  };

  it("ID-01: Should insert or update refresh token successfully", async () => {
    mockOnConflictDoUpdate.mockResolvedValueOnce(undefined);

    await expect(
      upsertRefreshToken(mockRecord)
    ).resolves.toBeUndefined();

    expect(mockInsert).toHaveBeenCalledTimes(1);
    expect(mockValues).toHaveBeenCalledWith({
      userId: 1,
      token: "hashed-token",
      expiresAt: mockRecord.expiresAt,
    });
    expect(mockOnConflictDoUpdate).toHaveBeenCalledTimes(1);
  });

  it("ID-02: Should propagate database error", async () => {
    mockOnConflictDoUpdate.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      upsertRefreshToken(mockRecord)
    ).rejects.toThrow("DB error");

    expect(mockInsert).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-17
describe("UTC-05-17: updateRefreshToken()", () => {

  const mockRecord: IRefreshToken = {
    userId: 1,
    token: "new-hashed-token",
    expiresAt: new Date("2026-01-01"),
  };

  it("ID-01: Should update refresh token successfully", async () => {
    mockWhereUpdate.mockResolvedValueOnce(undefined);

    await expect(
      updateRefreshToken(mockRecord)
    ).resolves.toBeUndefined();

    expect(mockUpdate).toHaveBeenCalledTimes(1);
    expect(mockSet).toHaveBeenCalledWith({
      token: "new-hashed-token",
      expiresAt: mockRecord.expiresAt,
    });
    expect(mockWhereUpdate).toHaveBeenCalledTimes(1);
  });

  it("ID-02: Should propagate database error", async () => {
    mockWhereUpdate.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      updateRefreshToken(mockRecord)
    ).rejects.toThrow("DB error");

    expect(mockUpdate).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-18
describe("UTC-05-18: findRefreshToken()", () => {

  const mockRecord: IRefreshToken = {
    userId: 1,
    token: "hashed-token",
    expiresAt: new Date("2026-01-01"),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ID-01: Should return refresh token record when found", async () => {
    mockFindRefreshTokenFirst.mockResolvedValueOnce(mockRecord);

    const result = await findRefreshToken("hashed-token");

    expect(mockFindRefreshTokenFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockRecord);
  });

  it("ID-02: Should return undefined when token not found", async () => {
    mockFindRefreshTokenFirst.mockResolvedValueOnce(undefined);

    const result = await findRefreshToken("unknown-token");

    expect(mockFindRefreshTokenFirst).toHaveBeenCalledTimes(1);
    expect(result).toBeUndefined();
  });

  it("ID-03: Should propagate database error", async () => {
    mockFindRefreshTokenFirst.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      findRefreshToken("hashed-token")
    ).rejects.toThrow("DB error");

    expect(mockFindRefreshTokenFirst).toHaveBeenCalledTimes(1);
  });
});

// #region UTC-05-19
describe("UTC-05-19: getUserProfileById()", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockUserProfile: Partial<IUser> = {
    id: 1,
    username: "admin",
    role: "admin",
  };

  it("ID-01: Should return user profile when found", async () => {
    mockFindFirst.mockResolvedValueOnce(mockUserProfile);

    const result = await getUserProfileById(1);

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUserProfile);
  });

  it("ID-02: Should return undefined when user not found", async () => {
    mockFindFirst.mockResolvedValueOnce(undefined);

    const result = await getUserProfileById(999);

    expect(result).toBeUndefined();
  });

  it("ID-03: Should propagate database error", async () => {
    mockFindFirst.mockRejectedValueOnce(new Error("DB error"));

    await expect(
      getUserProfileById(1)
    ).rejects.toThrow("DB error");

    expect(mockFindFirst).toHaveBeenCalledTimes(1);
  });
});