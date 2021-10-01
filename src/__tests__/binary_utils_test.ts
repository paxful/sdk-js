import { containsBinary } from "../commands/Invoke";

describe("There is utility containsBinary()", function () {
    it('If there is some file inside invoke body it returns true', async function () {
        expect(containsBinary({
            other: 123,
            some: Buffer.from("file")
        })).toBe(true);
    });
    it('If there is no files inside invoke body it returns false', async function () {
        expect(containsBinary({
            other: 123,
            some: "non-file content"
        })).toBe(false);
    });
});
