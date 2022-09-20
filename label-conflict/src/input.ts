import * as core from "@actions/core";

export const secretToken = core.getInput("secretToken", { required: true });
export const labelToAddOnConflict = core.getInput("labelToAddOnConflict", { required: true });
export const labelToRemoveOnConflict = core.getInput("labelToRemoveOnConflict");
export const retryIntervalSec = parseInt(core.getInput("retryIntervalSec"), 10);
export const retryMax = parseInt(core.getInput("retryMax"), 10);
export const commentToAddOnConflict = core.getInput("commentToAddOnConflict");
export const commentToAddOnClean = core.getInput("commentToAddOnClean");
export const ignorePermissionError = core.getInput("ignorePermissionError") === "true"; // Default: false
