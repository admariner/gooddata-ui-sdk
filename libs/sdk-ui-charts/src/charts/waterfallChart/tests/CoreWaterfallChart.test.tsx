// (C) 2023 GoodData Corporation
import React from "react";
import { render } from "@testing-library/react";
import { dummyBackend } from "@gooddata/sdk-backend-mockingbird";
import { prepareExecution } from "@gooddata/sdk-backend-spi";
import { emptyDef } from "@gooddata/sdk-model";

import { BaseChart } from "../../_base/BaseChart";
import { CoreWaterfallChart } from "../CoreWaterfallChart";

/**
 * This mock enables us to test props as parameters of the called chart function
 */
jest.mock("../../_base/BaseChart", () => ({
    BaseChart: jest.fn(() => null),
}));

describe("CoreWaterfallChart", () => {
    it("should render BaseChart", () => {
        render(
            <CoreWaterfallChart execution={prepareExecution(dummyBackend(), emptyDef("testWorkspace"))} />,
        );
        expect(BaseChart).toHaveBeenCalled();
    });
});