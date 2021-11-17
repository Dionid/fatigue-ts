declare type KnexSnakeCaseMappersResult = {
    postProcessResponse?: (result: any, queryContext: any) => any;
    wrapIdentifier?: (value: string, origImpl: (value: string) => string, queryContext: any) => string;
};
export declare function knexSnakeCaseMappers(opt?: {}): KnexSnakeCaseMappersResult;
export {};
