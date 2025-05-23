// (C) 2019-2025 GoodData Corporation
import { validateFilterOption } from "../OptionValidation.js";
import {
    IExtendedDateFilterErrors,
    IUiAbsoluteDateFilterForm,
    IUiRelativeDateFilterForm,
    DateFilterOption,
} from "../../interfaces/index.js";
import { describe, it, expect } from "vitest";

describe("validateFilterOption", () => {
    describe("absoluteForm validation", () => {
        it("should validate semantically correct form", () => {
            const filter: IUiAbsoluteDateFilterForm = {
                from: "2019-01-01",
                to: "2019-01-30",
                localIdentifier: "ABSOLUTE_FORM",
                type: "absoluteForm",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {};
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        const emptyFromFilter: IUiAbsoluteDateFilterForm = {
            from: undefined,
            to: "2019-01-30",
            localIdentifier: "ABSOLUTE_FORM",
            type: "absoluteForm",
            name: "",
            visible: true,
        };
        it("should not validate semantically incorrect from (with message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        dateError: "filters.staticPeriod.errors.emptyStartDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyFromFilter);
            expect(actual).toEqual(expected);
        });

        it("should not validate semantically incorrect from (with empty message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        dateError: "filters.staticPeriod.errors.emptyStartDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyFromFilter, {
                rangePosition: "from",
                parseError: "empty",
            });
            expect(actual).toEqual(expected);
        });

        it("should not validate semantically incorrect from (with invalid message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        dateError: "filters.staticPeriod.errors.invalidStartDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyFromFilter, {
                rangePosition: "from",
                parseError: "invalid",
            });
            expect(actual).toEqual(expected);
        });

        const emptyToFilter: IUiAbsoluteDateFilterForm = {
            from: "2019-01-30",
            to: undefined,
            localIdentifier: "ABSOLUTE_FORM",
            type: "absoluteForm",
            name: "",
            visible: true,
        };

        it("should not validate semantically incorrect to (with message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    to: {
                        dateError: "filters.staticPeriod.errors.emptyEndDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyToFilter);
            expect(actual).toEqual(expected);
        });

        it("should not validate semantically incorrect to (with empty message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    to: {
                        dateError: "filters.staticPeriod.errors.emptyEndDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyToFilter, { rangePosition: "to", parseError: "empty" });
            expect(actual).toEqual(expected);
        });

        it("should not validate semantically incorrect to (with invalid message)", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    to: {
                        dateError: "filters.staticPeriod.errors.invalidEndDate",
                    },
                },
            };
            const actual = validateFilterOption(emptyToFilter, {
                rangePosition: "to",
                parseError: "invalid",
            });
            expect(actual).toEqual(expected);
        });

        it("should not validate semantically incorrect to and from (with message)", () => {
            const filter: IUiAbsoluteDateFilterForm = {
                from: undefined,
                to: undefined,
                localIdentifier: "ABSOLUTE_FORM",
                type: "absoluteForm",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        dateError: "filters.staticPeriod.errors.emptyStartDate",
                    },
                    to: {
                        dateError: "filters.staticPeriod.errors.emptyEndDate",
                    },
                },
            };
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        it("should not validate hidden form (without message)", () => {
            const filter: IUiAbsoluteDateFilterForm = {
                from: "2019-01-01",
                to: "2019-01-30",
                localIdentifier: "ABSOLUTE_FORM",
                type: "absoluteForm",
                name: "",
                visible: false,
            };
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {},
            };
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        const startAfterEndFilter: IUiAbsoluteDateFilterForm = {
            from: "2019-01-30",
            to: "2019-01-29",
            localIdentifier: "ABSOLUTE_FORM",
            type: "absoluteForm",
            name: "",
            visible: true,
        };

        it("should not validate date starting after end when 'from' is edited", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        dateError: "filters.staticPeriod.errors.startDateAfterEndDate",
                    },
                },
            };
            const actual = validateFilterOption(startAfterEndFilter, { rangePosition: "from" });
            expect(actual).toEqual(expected);
        });

        it("should not validate date starting after end when 'to' is edited", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    to: {
                        dateError: "filters.staticPeriod.errors.endDateBeforeStartDate",
                    },
                },
            };
            const actual = validateFilterOption(startAfterEndFilter, { rangePosition: "to" });
            expect(actual).toEqual(expected);
        });

        const startTimeAfterEndTimeFilter: IUiAbsoluteDateFilterForm = {
            from: "2019-01-30 02:00",
            to: "2019-01-30 01:00",
            localIdentifier: "ABSOLUTE_FORM",
            type: "absoluteForm",
            name: "",
            visible: true,
        };

        it("should not validate time starting after end when 'from' is edited", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    from: {
                        timeError: "filters.staticPeriod.errors.startTimeAfterEndTime",
                    },
                },
            };
            const actual = validateFilterOption(startTimeAfterEndTimeFilter, { rangePosition: "from" });
            expect(actual).toEqual(expected);
        });

        it("should not validate time starting after end when 'to' is edited", () => {
            const expected: IExtendedDateFilterErrors = {
                absoluteForm: {
                    to: {
                        timeError: "filters.staticPeriod.errors.endTimeBeforeStartTime",
                    },
                },
            };
            const actual = validateFilterOption(startTimeAfterEndTimeFilter, { rangePosition: "to" });
            expect(actual).toEqual(expected);
        });
    });

    describe("relativeForm validation", () => {
        it("should validate semantically correct form", () => {
            const filter: IUiRelativeDateFilterForm = {
                from: 5,
                to: 5,
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity: "GDC.time.date",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {};
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        it("should validate semantically correct form with zeroes", () => {
            const filter: IUiRelativeDateFilterForm = {
                from: 0,
                to: 0,
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity: "GDC.time.date",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {};
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        it("should not validate form without from specified", () => {
            const filter: IUiRelativeDateFilterForm = {
                to: 5,
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity: "GDC.time.date",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {
                relativeForm: {},
            };
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        it("should not validate form without to specified", () => {
            const filter: IUiRelativeDateFilterForm = {
                from: 5,
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity: "GDC.time.date",
                name: "",
                visible: true,
            };
            const expected: IExtendedDateFilterErrors = {
                relativeForm: {},
            };
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });

        it("should not validate hidden form (without message)", () => {
            const filter: IUiRelativeDateFilterForm = {
                from: 5,
                to: 5,
                localIdentifier: "RELATIVE_FORM",
                type: "relativeForm",
                granularity: "GDC.time.date",
                name: "",
                visible: false,
            };
            const expected: IExtendedDateFilterErrors = {
                relativeForm: {},
            };
            const actual = validateFilterOption(filter);
            expect(actual).toEqual(expected);
        });
    });

    describe("non-form validation", () => {
        it.each([
            [
                "relative preset",
                {
                    from: 5,
                    to: 5,
                    localIdentifier: "RELATIVE_PRESET",
                    type: "relativePreset",
                    granularity: "GDC.time.date",
                    name: "",
                    visible: true,
                },
            ],
            [
                "absolute preset",
                {
                    from: "2019-01-01",
                    to: "2019-01-30",
                    localIdentifier: "ABSOLUTE_PRESET",
                    type: "absoluteForm",
                    visible: true,
                },
            ],
            [
                "all time",
                {
                    localIdentifier: "ALL_TIME",
                    name: "",
                    type: "allTime",
                    visible: true,
                },
            ],
        ])("should validate visible %s filter", (_, filter: any) => {
            const actual = validateFilterOption(filter);
            const expected: IExtendedDateFilterErrors = {};
            expect(actual).toEqual(expected);
        });

        const Scenarios: Array<[string, DateFilterOption]> = [
            [
                "relative preset",
                {
                    from: 5,
                    to: 5,
                    localIdentifier: "RELATIVE_PRESET",
                    type: "relativePreset",
                    granularity: "GDC.time.date",
                    name: "",
                    visible: false,
                },
            ],
            [
                "absolute preset",
                {
                    from: "2019-01-01",
                    to: "2019-01-30",
                    localIdentifier: "ABSOLUTE_PRESET",
                    type: "absoluteForm",
                    name: "",
                    visible: false,
                },
            ],
            [
                "all time",
                {
                    localIdentifier: "ALL_TIME",
                    name: "",
                    type: "allTime",
                    visible: false,
                },
            ],
        ];

        it.each(Scenarios)("should not validate invisible %s filter", (_, filter: DateFilterOption) => {
            const actual = validateFilterOption(filter);
            const expected: IExtendedDateFilterErrors = {
                [filter.type]: {},
            };
            expect(actual).toEqual(expected);
        });
    });
});
