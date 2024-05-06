export type SuccessMessage = {
    message: "success";
    detail?: any;
};

export type FailureMessage = {
    message: "fail";
    error: string;
};
