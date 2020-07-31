import { compose } from 'lodash/fp';

type Transform<T, U> = (input: T) => U;

type Reducer<Acc, T> = (acc: Acc, value: T) => Acc;

type Predicate<T> = (value: T) => boolean;

type Transducer<Acc, T, U = T> = (reducer: Reducer<Acc, U>) => Reducer<Acc, T>;

const map = <Acc, T, U = T>(transform: Transform<T, U>): Transducer<Acc, T, U> =>
    (next: Reducer<Acc, U>): Reducer<Acc, T> =>
        (acc, value) => next(acc, transform(value));

const filter = <Acc, T>(predicate: Predicate<T>): Transducer<Acc, T> =>
    (next: Reducer<Acc, T>): Reducer<Acc, T> =>
        (acc: Acc, value: T) => predicate(value) ? next(acc, value) : acc;

const isEven = (value: number): boolean => value % 2 === 0;
const double = (value: number): number => value * 2;

const doubleEvens = <Acc>(reducer: Reducer<Acc, number>) => compose<[Reducer<Acc, number>], Reducer<Acc, number>, Reducer<Acc, number>>(
    filter(isEven),
    map(double),
)(reducer);

const arrayConcat = <T>(acc: T[], value: T): T[] => acc.concat(value);

const doubleEvensReducer = doubleEvens<number[]>(arrayConcat);

const result = [1, 2, 3, 4, 5, 6].reduce(doubleEvensReducer, []);

console.log(result);
