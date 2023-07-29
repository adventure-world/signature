import mongoose from "mongoose";

async function insertMlMandRelation(mlmRecord: { invitedId: string; id: string }) {

}

jest.useRealTimers();
describe("推荐关系表", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://dagen:dagen_password@127.0.0.1:27717/dagen");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });


  test("mock A_B_C_D_A", async () => {
    const mlmRecord_A_B = { invitedId: "A", id: "B" };
    await insertMlMandRelation(mlmRecord_A_B);

    const mlmRecord_B_C = { invitedId: "B", id: "C" };
    await insertMlMandRelation(mlmRecord_B_C);

    const mlmRecord_C_D = { invitedId: "C", id: "D" };
    await insertMlMandRelation(mlmRecord_C_D);

    const mlmRecord_D_A = { invitedId: "D", id: "A" };
    await insertMlMandRelation(mlmRecord_D_A);
  });

  /**
   * 制作循环邀请case
   * A-B-C-A     (X)
   * A-D
   *
   * B-F-G
   *
   * Y-T-Z
   * T-W-Y
   */
  test("mock 循环邀请", async () => {
    const mlmRecord_A_B = { invitedId: "A", id: "B" };
    await insertMlMandRelation(mlmRecord_A_B);

    const mlmRecord_A_D = { invitedId: "A", id: "D" };
    await insertMlMandRelation(mlmRecord_A_D);

    const mlmRecord_B_C = { invitedId: "B", id: "C" };
    await insertMlMandRelation(mlmRecord_B_C);
    const mlmRecord_B_F = { invitedId: "B", id: "F" };
    await insertMlMandRelation(mlmRecord_B_F);
    const mlmRecord_F_G = { invitedId: "F", id: "G" };
    await insertMlMandRelation(mlmRecord_F_G);

    const mlmRecord_C_A = { invitedId: "C", id: "A" };
    await insertMlMandRelation(mlmRecord_C_A);

    const mlmRecord_Y_T = { invitedId: "Y", id: "T" };
    await insertMlMandRelation(mlmRecord_Y_T);

    const mlmRecord_T_Z = { invitedId: "T", id: "Z" };
    await insertMlMandRelation(mlmRecord_T_Z);

    const mlmRecord_T_W = { invitedId: "T", id: "W" };
    await insertMlMandRelation(mlmRecord_T_W);

    const mlmRecord_W_Y = { invitedId: "W", id: "Y" };
    await insertMlMandRelation(mlmRecord_W_Y);
  });

  test("线上数据，循环邀请", async () => {
    const mlmRecord_4 = {
      invitedId: "0x00c0fbf6345cdc5c9d32c21f61b4ac6386cbdbd3",
      id: "0x006fc5a99f92bf112d4bf28962209d5e5bef635d"
    };
    await insertMlMandRelation(mlmRecord_4);

    const mlmRecord_1 = {
      invitedId: "0x006fc5a99f92bf112d4bf28962209d5e5bef635d",
      id: "0xd5d5e428f933199d91529e08398a5c885682cade"
    };
    await insertMlMandRelation(mlmRecord_1);

    const mlmRecord_3 = {
      invitedId: "0x5c16af160b48f626cb55c576fe1e570183f3a6ab",
      id: "0x00c0fbf6345cdc5c9d32c21f61b4ac6386cbdbd3"
    };
    await insertMlMandRelation(mlmRecord_3);

    const mlmRecord_2 = {
      invitedId: "0xd5d5e428f933199d91529e08398a5c885682cade",
      id: "0x5c16af160b48f626cb55c576fe1e570183f3a6ab"
    };
    await insertMlMandRelation(mlmRecord_2);
  });
});
