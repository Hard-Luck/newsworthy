export function isSorted<T>(array: T[], key: keyof T, descending = true): boolean {
    if (array.length <= 1) {
        return true;
    }
    for (let i = 1; i < array.length; i++) {
        if (descending ? array[i - 1][key] < array[i][key] : array[i - 1][key] > array[i][key]) {
            return false;
        }
    }
    return true;
}
