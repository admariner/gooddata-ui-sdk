// (C) 2019-2020 GoodData Corporation

import { ObjRef } from "@gooddata/sdk-model";
import isEmpty from "lodash/isEmpty";

/**
 * Single calculated data value. The data value may be `null` - the semantics here are same as with
 * SQL nulls. The calculated numeric value WILL be returned in string representation - this is to
 * prevent float number precision errors.
 *
 * @public
 */
export type DataValue = null | string | number;

/**
 * Describes measure group and its contents.
 * @public
 */
export interface IMeasureGroupDescriptor {
    // TODO: rename this to measureGroupDescriptor ... the goal is to get rid of the overused 'header' nomenclature
    measureGroupHeader: {
        items: IMeasureDescriptor[];
        totalItems?: ITotalDescriptor[];
    };
}

/**
 * Describes measure included in a dimension.
 *
 * @public
 */
export interface IMeasureDescriptor {
    // TODO: rename this to measureDescriptor ... the goal is to get rid of the overused 'header' nomenclature
    measureHeaderItem: {
        localIdentifier: string;

        /**
         * Measure name. Backend must fill the name according to the following rules:
         *
         * -  If measure definition contained 'title', then name MUST equal to 'title',
         * -  Else if measure definition contained 'alias', then name MUST equal to 'alias',
         * -  Else if the backend has a name of the measure in its records, then it MUST include that name
         * -  Otherwise the name must default to value of localIdentifier
         */
        name: string;

        /**
         * Measure format. Backend must fill the name according to the following rules:
         *
         * -  If measure definition contained 'format', then the format from the definition MUST be used
         * -  Else if backend has a format for the measure in its records, then it MUST include that format
         * -  Otherwise the format must be defaulted
         */
        format: string;

        /**
         * For persistent metrics or facts, this returns URI of the object. Is empty for ad-hoc measures.
         */
        uri?: string;

        /**
         * For persistent metrics or facts, this returns identifier of the object. Is empty for ad-hoc measures.
         */
        identifier?: string;

        /**
         * Opaque reference of the metric or fact object.
         */
        ref?: ObjRef;
    };
}

/**
 * Describes total included in a dimension.
 *
 * @public
 */
export interface ITotalDescriptor {
    // TODO: rename this to totalDescriptor ... the goal is to get rid of the overused 'header' nomenclature
    totalHeaderItem: {
        name: string;
    };
}

/**
 * Describes attribute slicing of a dimension. The primary descriptor is the attribute display form which was
 * used to slice the dimension. Description of the attribute to which the display form belongs is provided in the
 * `formOf` property.
 *
 * @public
 */
export interface IAttributeDescriptor {
    // TODO: rename this to attributeDescriptor ... the goal is to get rid of the overused 'header' nomenclature
    attributeHeader: {
        /**
         * URI of the display form object
         */
        uri: string;

        /**
         * Display form identifier
         */
        identifier: string;

        /**
         * Local identifier of the display form - this references back to the IAttribute which was on the input
         * to the execution.
         */
        localIdentifier: string;

        /**
         * Opaque reference of the display form object.
         */
        ref: ObjRef;

        /**
         * Human readable name of the attribute.
         */
        name: string;
        totalItems?: ITotalDescriptor[];

        /**
         * Display form type
         */
        type?: string;

        /**
         * Describes attributes to which the display form belongs.
         */
        formOf: {
            /**
             * Opaque reference of the attribute object.
             */
            ref: ObjRef;

            /**
             * URI of the attribute object.
             */
            uri: string;

            /**
             * Attribute identifier.
             */
            identifier: string;

            /**
             * Human readable name of the attribute.
             *
             * Note: attribute name is typically more descriptive than the display form. Therefore, visualizations
             * often use the attribute name for axes and other descriptive elements of the chart such as tooltips.
             *
             * For example attribute called 'Location' may have multiple display forms each with different name and possibly
             * also different data type such as 'ShortName', 'LongName', 'Coordinates', 'Link' etc. Using the display
             * form name would often lead to visualizations which are harder to comprehend.
             */
            name: string;
        };
    };
}

/**
 * Headers describing contents of a dimension.
 *
 * @public
 */
export type IDimensionItemDescriptor = IMeasureGroupDescriptor | IAttributeDescriptor;

/**
 * Dimension descriptor is the output counter-part of the dimension specification that was included in the
 * execution definition.
 *
 * It describes in further detail the LDM objects which were used to obtain data and metadata for the dimension
 * in the cross-tabulated result.
 *
 * The information is provided in a form of attribute or measure group descriptors. The contract is that the
 * descriptors appear in the same order as they were specified in the execution definition.
 *
 * This best best demonstrated using examples.
 *
 * 1. Execution was done for attribute A1 and measures M1 and M2. Both attribute and measureGroup are in single
 *    dimension.
 *
 * The result dimension will contain two headers, first will be header describing the attribute {@link IAttributeDescriptor},
 * followed by {@link IMeasureGroupDescriptor}. The measure group header contains two items - one for each requested
 * measure.
 *
 * 2. Execution was done for attributes A1 and A2, measures M1 and M2. Attribute A1 is in first dimension and
 *    the remainder of objects (A2 and measureGroup) is in second dimension.
 *
 * There will be two result dimension descriptors. First descriptor will specify single header for A1 attribute,
 * second descriptor will have two headers, first will be header for attribute A2 and then measure group header
 * with two items.
 *
 * @public
 */
export interface IDimensionDescriptor {
    // TODO: consider renaming this to itemDescriptors or something ...
    //  the goal is to get rid of the overused 'header' nomenclature
    headers: IDimensionItemDescriptor[];
}

/**
 * Attribute header specifies name and URI of the attribute element to which the calculated measure
 * values in the particular data view slice belong.
 *
 * @public
 */
export interface IResultAttributeHeader {
    attributeHeaderItem: {
        /**
         * Human readable name of the attribute element
         */
        name: string;

        /**
         * URI of the attribute element. This is essentially a primary key of the attribute element. It can
         * be used in places where attribute elements have to be exactly specified - such as positive or
         * negative attribute filters.
         *
         * It is up to the backend implementation whether the URI is transferable across workspaces or not in the
         * data distribution scenarios. In other words, if a data for one attribute (say Product) is distributed
         * into multiple workspaces, it is up to the backend whether the URIs of the elements will be same across
         * all workspaces or not.
         *
         * Recommendation for the consumers: URI is safe to use if you obtain in programatically from this header
         * and then use it in the same workspace for instance for filtering. It is not safe to hardcode URIs
         * and use them in a solution which should operate on top of different workspaces.
         */
        uri: string;
    };
}

/**
 * Measure header specifes name of the measure to which the calculated values in the particular data view slice belong.
 *
 * Measure header also specifies 'order' - this is essentially an index into measure group descriptor's item array; it
 * can be used to obtain further information about the measure.
 *
 * @public
 */
export interface IResultMeasureHeader {
    measureHeaderItem: {
        /**
         * Measure name - equals to the measure name contained in the respective measure descriptor, included here
         * for convenience and easy access.
         *
         * Note: check out the contract for measure name as described in {@link IMeasureDescriptor} - it is
         * somewhat more convoluted than one would expect.
         */
        name: string;

        /**
         * Index of this measure's descriptor within the measure group description. The measure group descriptor
         * is included in the execution result.
         */
        order: number;
    };
}

/**
 * Total header specifies name and type of total to which the calculated values in particular data view slice belong.
 *
 * @public
 */
export interface IResultTotalHeader {
    totalHeaderItem: {
        name: string;
        type: string;
    };
}

/**
 * Result headers provide metadata about data included in the data view. They are integral part of the data view
 * and are organized in per-dimension and per-dimension-item arrays.
 *
 * @remarks see {@link IDataView} for further detail on the organization.
 *
 * @public
 */
export type IResultHeader = IResultAttributeHeader | IResultMeasureHeader | IResultTotalHeader;

/**
 * Represents an execution result warning.
 * (e.g. when execution was executed successfully, but backend didn't take something into the account)
 *
 * @public
 */
export interface IResultWarning {
    /**
     * Unique identifier of the execution warning
     */
    warningCode: string;

    /**
     * Human readable representation of the execution warning, with C-like printf parameter placehodlers.
     * The values for the placeholders are in the parameters array in the order in which they should replace the placeholders.
     *
     * Example: "metric filter on dimension [%s] not applied"
     */
    message: string;

    /**
     * Execution warning parameters (e.g. when filter was not applied - its ObjRef)
     */
    parameters?: (ObjRef | string)[];
}

//
// Type guards
//

/**
 * Type-guard testing whether the provided object is an instance of {@link IAttributeDescriptor}.
 *
 * @public
 */
export function isAttributeDescriptor(obj: unknown): obj is IAttributeDescriptor {
    return !isEmpty(obj) && (obj as IAttributeDescriptor).attributeHeader !== undefined;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IMeasureGroupDescriptor}.
 *
 * @public
 */
export function isMeasureGroupDescriptor(obj: unknown): obj is IMeasureGroupDescriptor {
    return !isEmpty(obj) && (obj as IMeasureGroupDescriptor).measureGroupHeader !== undefined;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IMeasureDescriptor}.
 *
 * @public
 */
export function isMeasureDescriptor(obj: unknown): obj is IMeasureDescriptor {
    return !isEmpty(obj) && (obj as IMeasureDescriptor).measureHeaderItem !== undefined;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link ITotalDescriptor}.
 *
 * @public
 */
export function isTotalDescriptor(obj: unknown): obj is ITotalDescriptor {
    return !isEmpty(obj) && (obj as ITotalDescriptor).totalHeaderItem !== undefined;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IResultAttributeHeader}.
 *
 * @public
 */
export function isResultAttributeHeader(obj: unknown): obj is IResultAttributeHeader {
    return !isEmpty(obj) && (obj as IResultAttributeHeader).attributeHeaderItem !== undefined;
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IResultMeasureHeader}.
 *
 * @public
 */
export function isResultMeasureHeader(obj: unknown): obj is IResultMeasureHeader {
    return (
        !isEmpty(obj) &&
        (obj as IResultMeasureHeader).measureHeaderItem !== undefined &&
        (obj as IResultMeasureHeader).measureHeaderItem.order !== undefined
    );
}

/**
 * Type-guard testing whether the provided object is an instance of {@link IResultTotalHeader}.
 *
 * @public
 */
export function isResultTotalHeader(obj: unknown): obj is IResultTotalHeader {
    return (
        !isEmpty(obj) &&
        (obj as IResultTotalHeader).totalHeaderItem !== undefined &&
        (obj as IResultTotalHeader).totalHeaderItem.type !== undefined
    );
}

//
//
//

/**
 * Returns item name contained within a result header.
 *
 * @param header - header of any type
 * @public
 */
export function resultHeaderName(header: IResultHeader): string {
    if (isResultAttributeHeader(header)) {
        return header.attributeHeaderItem.name;
    } else if (isResultMeasureHeader(header)) {
        return header.measureHeaderItem.name;
    }

    return header.totalHeaderItem.name;
}

/**
 * Returns local identifier of attribute described in the provided attribute descriptor.
 *
 * @param descriptor - attribute descriptor, must be specified
 * @public
 */
export function attributeDescriptorLocalId(descriptor: IAttributeDescriptor): string {
    return descriptor.attributeHeader.localIdentifier;
}

/**
 * Returns name of attribute described in the provided attribute descriptor.
 *
 * @param descriptor - attribute descriptor, must be specified
 * @public
 */
export function attributeDescriptorName(descriptor: IAttributeDescriptor): string {
    return descriptor.attributeHeader.formOf.name;
}
